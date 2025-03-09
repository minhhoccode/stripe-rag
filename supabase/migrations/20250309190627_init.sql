-- Kích hoạt các extension cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Bảng users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id TEXT UNIQUE GENERATED ALWAYS AS (id::TEXT) STORED,
    email TEXT,
    name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    token_identifier TEXT NOT NULL, -- Sẽ được điền qua trigger
    subscription TEXT,
    credits TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(user_id),
    stripe_id TEXT UNIQUE,
    price_id TEXT,
    stripe_price_id TEXT,
    currency TEXT,
    interval TEXT,
    status TEXT,
    current_period_start BIGINT,
    current_period_end BIGINT,
    cancel_at_period_end BOOLEAN,
    amount BIGINT,
    started_at BIGINT,
    ends_at BIGINT,
    ended_at BIGINT,
    canceled_at BIGINT,
    customer_cancellation_reason TEXT,
    customer_cancellation_comment TEXT,
    metadata JSONB,
    custom_field_data JSONB,
    customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng webhook_events
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL,
    type TEXT NOT NULL,
    stripe_event_id TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Departments
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Roles
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    permissions JSONB DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng User-Departments
CREATE TABLE IF NOT EXISTS public.user_departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE SET NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, department_id)
);

-- Bảng Chatbots
CREATE TABLE IF NOT EXISTS public.chatbots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    system_prompt TEXT,
    condense_prompt TEXT,
    llm_config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Datasources
CREATE TABLE IF NOT EXISTS public.datasources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    chatbot_id UUID REFERENCES public.chatbots(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Documents
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    datasource_id UUID REFERENCES public.datasources(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('file', 'url')),
    file_path TEXT,
    url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Chunks
CREATE TABLE IF NOT EXISTS public.chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Chunk Embeddings
CREATE TABLE IF NOT EXISTS public.chunk_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chunk_id UUID REFERENCES public.chunks(id) ON DELETE CASCADE,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chatbot_id UUID REFERENCES public.chatbots(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng Feedbacks
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events(type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON public.webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_departments_user_id ON public.user_departments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_departments_department_id ON public.user_departments(department_id);
CREATE INDEX IF NOT EXISTS idx_chatbots_department_id ON public.chatbots(department_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_chatbot_id ON public.conversations(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chunk_embeddings_embedding ON public.chunk_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Trigger để cập nhật updated_at (Đã sửa lỗi cú pháp)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    r RECORD; -- Khai báo r là một bản ghi
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT IN ('webhook_events')) LOOP
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at();', r.tablename, r.tablename);
    END LOOP;
END;
$$;

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunk_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid()::TEXT = user_id);
CREATE POLICY "Service role can manage webhook events" ON public.webhook_events FOR ALL TO service_role USING (true);
CREATE POLICY "Super Admin can manage departments" ON public.departments FOR ALL USING (EXISTS (SELECT 1 FROM public.user_departments ud JOIN public.roles r ON ud.role_id = r.id WHERE ud.user_id = auth.uid() AND r.name = 'Super Admin'));
CREATE POLICY "Super Admin can manage roles" ON public.roles FOR ALL USING (EXISTS (SELECT 1 FROM public.user_departments ud JOIN public.roles r ON ud.role_id = r.id WHERE ud.user_id = auth.uid() AND r.name = 'Super Admin'));
CREATE POLICY "Users can view own departments" ON public.user_departments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Department Admin can manage chatbots" ON public.chatbots FOR ALL USING (EXISTS (SELECT 1 FROM public.user_departments ud JOIN public.roles r ON ud.role_id = r.id WHERE ud.user_id = auth.uid() AND ud.department_id = chatbots.department_id AND r.name = 'Department Admin'));
CREATE POLICY "Users can view own chatbots" ON public.chatbots FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_departments ud WHERE ud.user_id = auth.uid() AND ud.department_id = chatbots.department_id));
CREATE POLICY "Chatbots can manage own datasources" ON public.datasources FOR ALL USING (EXISTS (SELECT 1 FROM public.chatbots c WHERE c.id = datasources.chatbot_id AND EXISTS (SELECT 1 FROM public.user_departments ud JOIN public.roles r ON ud.role_id = r.id WHERE ud.user_id = auth.uid() AND ud.department_id = c.department_id AND r.name IN ('Department Admin', 'Super Admin'))));
CREATE POLICY "Datasources can manage own documents" ON public.documents FOR ALL USING (EXISTS (SELECT 1 FROM public.datasources ds WHERE ds.id = documents.datasource_id AND EXISTS (SELECT 1 FROM public.chatbots c WHERE c.id = ds.chatbot_id AND EXISTS (SELECT 1 FROM public.user_departments ud JOIN public.roles r ON ud.role_id = r.id WHERE ud.user_id = auth.uid() AND ud.department_id = c.department_id AND r.name IN ('Department Admin', 'Super Admin')))));
CREATE POLICY "Documents can manage own chunks" ON public.chunks FOR ALL USING (EXISTS (SELECT 1 FROM public.documents d WHERE d.id = chunks.document_id AND EXISTS (SELECT 1 FROM public.datasources ds WHERE ds.id = d.datasource_id AND EXISTS (SELECT 1 FROM public.chatbots c WHERE c.id = ds.chatbot_id AND EXISTS (SELECT 1 FROM public.user_departments ud JOIN public.roles r ON ud.role_id = r.id WHERE ud.user_id = auth.uid() AND ud.department_id = c.department_id AND r.name IN ('Department Admin', 'Super Admin'))))));
CREATE POLICY "Chunks can manage own embeddings" ON public.chunk_embeddings FOR ALL USING (EXISTS (SELECT 1 FROM public.chunks c WHERE c.id = chunk_embeddings.chunk_id AND EXISTS (SELECT 1 FROM public.documents d WHERE d.id = c.document_id AND EXISTS (SELECT 1 FROM public.datasources ds WHERE ds.id = d.datasource_id AND EXISTS (SELECT 1 FROM public.chatbots cb WHERE cb.id = ds.chatbot_id AND EXISTS (SELECT 1 FROM public.user_departments ud JOIN public.roles r ON ud.role_id = r.id WHERE ud.user_id = auth.uid() AND ud.department_id = cb.department_id AND r.name IN ('Department Admin', 'Super Admin')))))));
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Conversations can manage own messages" ON public.messages FOR ALL USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()));
CREATE POLICY "Users can manage own feedbacks" ON public.feedbacks FOR ALL USING (auth.uid() = user_id);

-- Trigger xử lý người dùng mới
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id, email, name, full_name, avatar_url, token_identifier, created_at, updated_at
    ) VALUES (
        NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url', NEW.id::TEXT, NEW.created_at, NEW.updated_at
    );
    INSERT INTO public.roles (name, permissions, description)
    VALUES ('User', '{"access_chat": true}', 'Default role for regular users')
    ON CONFLICT (name) DO NOTHING;
    INSERT INTO public.user_departments (user_id, department_id, role_id, is_default)
    SELECT NEW.id, d.id, r.id, TRUE
    FROM public.departments d, public.roles r
    WHERE d.name = 'Default' AND r.name = 'User'
    ON CONFLICT (user_id, department_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger xử lý cập nhật người dùng
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET email = NEW.email,
        name = NEW.raw_user_meta_data->>'name',
        full_name = NEW.raw_user_meta_data->>'full_name',
        avatar_url = NEW.raw_user_meta_data->>'avatar_url',
        updated_at = NEW.updated_at
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Tạo department mặc định
INSERT INTO public.departments (name, description)
VALUES ('Default', 'Default department for new users')
ON CONFLICT (name) DO NOTHING;

-- Tạo role mặc định
INSERT INTO public.roles (name, permissions, description)
VALUES ('Super Admin', '{"manage_system": true}', 'Full system access'),
       ('Department Admin', '{"manage_chatbots": true, "manage_users": true}', 'Manage department chatbots and users'),
       ('User', '{"access_chat": true}', 'Default role for regular users')
ON CONFLICT (name) DO NOTHING;