import { signInWithPopup } from 'firebase/auth'
import { AnimatePresence, motion } from 'motion/react'
import {
    X,
    Sparkles,
    ShieldCheck,
    // Chrome 
} from 'lucide-react'
import { provider, auth } from '../Firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserdata } from '../redux/userSlice'

const LoginModel = ({ open, onClose }) => {
    const dispatch = useDispatch()

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider)

            const { data } = await axios.post(
                'http://localhost:3002/auth/user/google',
                {
                    name: result.user.displayName,
                    email: result.user.email,
                    avatar: result.user.photoURL
                },
                { withCredentials: true }
            )
            if (data.success) {
                dispatch(setUserdata(data))
                onClose()
            }
        } catch (error) {
            console.error("Google Auth Error:", error)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className='w-full max-w-md relative p-[1px] rounded-[32px] bg-gradient-to-br from-purple-500/30 via-white/10 to-transparent shadow-2xl'
                    >
                        <div className='rounded-[31px] relative bg-[#0b0b0b] border border-white/5 overflow-hidden px-10 py-12 text-center'>
                            <button
                                onClick={onClose}
                                className='absolute top-6 right-6 text-zinc-500 hover:text-white transition p-2 hover:bg-white/5 rounded-full'
                            >
                                <X size={20} />
                            </button>

                            <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest text-zinc-400 font-bold mb-8 uppercase'>
                                <Sparkles size={12} className="text-purple-400" /> AI Powered Web Builder
                            </div>

                            <h2 className='text-4xl font-black mb-10 leading-tight'>
                                Ready to <br />
                                <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
                                    Build?
                                </span>
                            </h2>

                            <motion.button
                                onClick={handleGoogleAuth}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='w-full h-16 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-100 transition shadow-xl shadow-white/5 group'
                            >
                                {/* <Chrome className='text-red-500 group-hover:rotate-12 transition-transform' size={24} /> */}
                                Continue with Google
                            </motion.button>

                            <div className='mt-10 flex items-center gap-4 opacity-20'>
                                <div className='flex-1 h-[1px] bg-white' />
                                <ShieldCheck size={16} />
                                <div className='flex-1 h-[1px] bg-white' />
                            </div>

                            <p className='mt-10 text-[10px] text-zinc-600 font-bold uppercase tracking-widest'>
                                Secure Authentication via Google
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default LoginModel
