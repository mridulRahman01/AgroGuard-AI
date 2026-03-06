import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Provider } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

interface SocialProvider {
    name: string;
    id: Provider;
    color: string;
    icon: string;
}

const PROVIDERS: SocialProvider[] = [
    {
        name: 'Google',
        id: 'google',
        color: 'hover:bg-gray-50 border-gray-200 text-gray-700',
        icon: 'https://www.svgrepo.com/show/475656/google-color.svg'
    },
    {
        name: 'Facebook',
        id: 'facebook',
        color: 'hover:bg-blue-50 border-gray-200 text-gray-700',
        icon: 'https://www.svgrepo.com/show/475647/facebook-color.svg'
    },
    {
        name: 'GitHub',
        id: 'github',
        color: 'hover:bg-gray-50 border-gray-200 text-gray-700',
        icon: 'https://www.svgrepo.com/show/512317/github-142.svg'
    }
];

export const SocialLoginButtons = () => {
    const { signInWithOAuth } = useAuth();
    const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

    const handleLogin = async (provider: Provider) => {
        setLoadingProvider(provider);
        try {
            const { error } = await signInWithOAuth(provider);
            if (error) throw error;
        } catch (error: any) {
            toast.error(error.message || 'Error occurred during social login');
        } finally {
            setLoadingProvider(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500 font-medium font-['Hind_Siliguri',sans-serif]">
                    অথবা
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PROVIDERS.map(({ name, id, color, icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => handleLogin(id)}
                        disabled={loadingProvider !== null}
                        className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium transition-all font-['Inter',sans-serif] bg-white ${color} ${loadingProvider ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 shadow-sm hover:shadow'
                            }`}
                    >
                        {loadingProvider === id ? (
                            <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                            <img src={icon} alt={name} className="w-5 h-5" />
                        )}
                        <span className="sm:hidden lg:inline">{name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
