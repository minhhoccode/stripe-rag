"use client"

import { useEffect, useState } from 'react';
import { createClient } from '../../supabase/client';
import { useRouter } from 'next/navigation';

interface ClientSubscriptionCheckProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function ClientSubscriptionCheck({
    children,
    redirectTo = '/pricing'
}: ClientSubscriptionCheckProps) {
    const router = useRouter();
    const supabase = createClient();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        async function checkSubscription() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/sign-in');
                return;
            }

            const { data: subscription, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .single();

            if (error || !subscription) {
                router.push(redirectTo);
                return;
            }

            setIsChecking(false);
        }

        checkSubscription();
    }, [redirectTo, router]);

    if (isChecking) {
        return null;
    }

    return <>{children}</>;
}
