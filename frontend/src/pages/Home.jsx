import { AnimatePresence, motion } from 'motion/react'
import LoginModel from '../components/LoginModel'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { 
    Zap, 
    LogOut, 
    Layout, 
    ChevronRight, 
    ArrowRight, 
    Sparkles, 
    Code, 
    Smartphone,
    UserCircle
} from 'lucide-react'
import axios from 'axios'
import { setUserdata } from '../redux/userSlice.js'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const highlights = [
        { title: "AI Generated Code", icon: <Sparkles size={24} className="text-purple-400" /> },
        { title: "Fully Responsive", icon: <Smartphone size={24} className="text-blue-400" /> },
        { title: "Clean Structure", icon: <Code size={24} className="text-pink-400" /> }
    ]

    const [openlogin, setOpenlogin] = useState(false)
    const userData = useSelector(state => state.user.userData?.user)
    const [openProfile, setOpenProfile] = useState(false)

    const handleLogOut = async () => {
        try {
            await axios.get("http://localhost:3002/auth/user/logout", { withCredentials: true })
            dispatch(setUserdata(null))
            window.location.reload()
        } catch (error) {
            console.error("Logout Error:", error)
        }
    }

    return (
        <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>
            {/* Navbar */}
            <motion.div
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/10'
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
                    <div className='text-2xl font-bold flex items-center gap-2'>
                        <Layout className="text-purple-500" />
                        Gamer GPT
                    </div>

                    <div className='flex items-center gap-6'>
                        <div className='hidden md:inline text-zinc-400 hover:text-white text-sm font-medium cursor-pointer transition'>
                            Pricing
                        </div>
                        {userData && (
                            <div className='hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition cursor-default'>
                                <Zap size={14} className='text-yellow-500 fill-yellow-500' />
                                <span className='text-zinc-300 font-bold'>{userData.credits}</span>
                            </div>
                        )}
                        {userData ? (
                            <div className='relative'>
                                <button onClick={() => setOpenProfile(!openProfile)} className='flex items-center relative group'>
                                    <UserCircle className='h-9 w-9 text-zinc-400 group-hover:text-white transition' />
                                </button>
                                <AnimatePresence>
                                    {openProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className='absolute right-0 top-full mt-3 w-64 z-50 rounded-2xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden'
                                        >
                                            <div className='px-5 py-4 border-b border-white/10 bg-white/[0.02]'>
                                                <p className='text-sm font-bold truncate'>{userData.name}</p>
                                                <p className='text-[10px] text-zinc-500 truncate uppercase tracking-widest mt-1 font-bold'>{userData.email}</p>
                                            </div>
                                            <div className='p-2'>
                                                <button onClick={() => navigate('/dashbord')} className='flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium hover:bg-white/5 rounded-xl transition'>
                                                    <Layout size={16} className="text-zinc-400" /> Dashboard
                                                </button>
                                                <button onClick={() => handleLogOut()} className='flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium hover:bg-red-500/10 text-red-500 rounded-xl transition'>
                                                    <LogOut size={16} /> Log out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button onClick={() => setOpenlogin(true)} className='px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition shadow-lg shadow-white/5'>
                                Get started
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Hero Section */}
            <section className='pt-56 pb-32 px-6 text-center relative'>
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase mb-8">
                        <Sparkles size={12} /> Next-Gen Web Builder
                    </div>
                    <h1 className='text-6xl md:text-8xl font-black tracking-tighter leading-none'>
                        Build Stunning <br />
                        <span className='bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent'>
                            AI Websites
                        </span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className='mt-10 max-w-2xl mx-auto text-xl text-zinc-400 font-medium leading-relaxed'
                >
                    The most powerful AI-driven web builder. Describe your vision and watch as we generate production-ready code in seconds.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <button 
                        className='group px-12 py-5 rounded-2xl bg-white text-black font-bold text-xl mt-14 hover:scale-105 transition-all flex items-center gap-3 mx-auto shadow-2xl shadow-white/10' 
                        onClick={() => userData ? navigate('/dashbord') : setOpenlogin(true)}
                    >
                        {userData ? "Go to Dashboard" : "Start Building"}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </section>

            {/* Highlights Section */}
            <section className='max-w-7xl mx-auto px-6 pb-40'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {highlights.map((h, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className='group p-10 rounded-[32px] bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all'
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                                {h.icon}
                            </div>
                            <h1 className='mb-4 text-2xl font-bold'>{h.title}</h1>
                            <p className='text-zinc-500 leading-relaxed font-medium'>
                                Our AI constructs semantic, SEO-friendly code that is ready for deployment right out of the box.
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className='border-t border-white/5 py-12 text-center'>
                <div className="text-xl font-bold mb-4 opacity-50 flex items-center justify-center gap-2">
                    <Layout size={20} /> Gamer GPT
                </div>
                <p className="text-sm text-zinc-600 font-medium tracking-wide uppercase">
                    &copy; {new Date().getFullYear()} AI-Powered Future. All rights reserved.
                </p>
            </footer>

            {/* Modals */}
            <LoginModel open={openlogin} onClose={() => setOpenlogin(false)} />
        </div>
    )
}

export default Home
