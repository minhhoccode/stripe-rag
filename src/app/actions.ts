"use server";

import { createClient } from "../../supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Đăng ký tài khoản
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect("error", "/sign-up", "Email and password are required");
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { full_name: fullName, email },
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

// Đăng nhập
export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

// Quên mật khẩu
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    return encodedRedirect("error", "/forgot-password", "Could not reset password");
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

// Đặt lại mật khẩu
export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect("error", "/protected/reset-password", "Password and confirm password are required");
  }

  if (password !== confirmPassword) {
    return encodedRedirect("error", "/protected/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return encodedRedirect("error", "/protected/reset-password", "Password update failed");
  }

  return encodedRedirect("success", "/protected/reset-password", "Password updated");
};

// Đăng xuất
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// Kiểm tra subscription
export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();
  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error) return false;
  return !!subscription;
};

// Tạo Department
export const createDepartmentAction = async (formData: FormData) => {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return encodedRedirect("error", "/departments", "Unauthorized");

  const { data: role, error: roleError } = await supabase
    .from("user_departments")
    .select("roles(name)")
    .eq("user_id", user.id)
    .eq("roles.name", "Super Admin")
    .single();

  if (roleError || !role) return encodedRedirect("error", "/departments", "Permission denied");

  const { error } = await supabase
    .from("departments")
    .insert({ name, description });

  if (error) return encodedRedirect("error", "/departments", error.message);

  return redirect("/departments");
};

// Tạo Chatbot
export const createChatbotAction = async (formData: FormData) => {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const departmentId = formData.get("department_id") as string;
  const systemPrompt = formData.get("system_prompt") as string;
  const condensePrompt = formData.get("condense_prompt") as string;
  const llmConfig = JSON.parse(formData.get("llm_config") as string);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return encodedRedirect("error", "/chatbots", "Unauthorized");

  const { data: role, error: roleError } = await supabase
    .from("user_departments")
    .select("roles(name)")
    .eq("user_id", user.id)
    .eq("department_id", departmentId)
    .in("roles.name", ["Department Admin", "Super Admin"])
    .single();

  if (roleError || !role) return encodedRedirect("error", "/chatbots", "Permission denied");

  const { error } = await supabase
    .from("chatbots")
    .insert({
      name,
      description,
      department_id: departmentId,
      system_prompt: systemPrompt,
      condense_prompt: condensePrompt,
      llm_config: llmConfig,
    });

  if (error) return encodedRedirect("error", "/chatbots", error.message);

  return redirect("/chatbots");
};

// Tải lên Document
export const uploadDocumentAction = async (formData: FormData) => {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  const url = formData.get("url") as string;
  const datasourceId = formData.get("datasource_id") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return encodedRedirect("error", "/datasources", "Unauthorized");

  const { data: permission, error: permError } = await supabase
    .from("datasources")
    .select("chatbots(department_id)")
    .eq("id", datasourceId)
    .single();

  if (permError || !permission) return encodedRedirect("error", "/datasources", "Invalid datasource");

  const { data: role, error: roleError } = await supabase
    .from("user_departments")
    .select("roles(name)")
    .eq("user_id", user.id)
    .eq("department_id", permission.chatbots.department_id)
    .in("roles.name", ["Department Admin", "Super Admin"])
    .single();

  if (roleError || !role) return encodedRedirect("error", "/datasources", "Permission denied");

  let filePath = null;
  if (file) {
    const { data, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(`${datasourceId}/${file.name}`, file);
    if (uploadError) return encodedRedirect("error", "/datasources", uploadError.message);
    filePath = data.path;
  }

  const { error } = await supabase
    .from("documents")
    .insert({
      datasource_id: datasourceId,
      name: file ? file.name : url,
      type: file ? "file" : "url",
      file_path: filePath,
      url: url || null,
    });

  if (error) return encodedRedirect("error", "/datasources", error.message);

  return redirect("/datasources");
};

// Xuất báo cáo hội thoại
export const exportConversationsReportAction = async (chatbotId: string) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: permission, error: permError } = await supabase
    .from("chatbots")
    .select("department_id")
    .eq("id", chatbotId)
    .single();

  if (permError || !permission) throw new Error("Invalid chatbot");

  const { data: role, error: roleError } = await supabase
    .from("user_departments")
    .select("roles(name)")
    .eq("user_id", user.id)
    .eq("department_id", permission.department_id)
    .in("roles.name", ["Department Admin", "Super Admin"])
    .single();

  if (roleError || !role) throw new Error("Permission denied");

  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, created_at, messages(content, role, created_at)")
    .eq("chatbot_id", chatbotId);

  if (error) throw new Error(error.message);

  return data; // Trả về dữ liệu để xử lý (ví dụ: xuất CSV)
};