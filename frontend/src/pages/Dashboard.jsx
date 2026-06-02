import { motion } from 'motion/react'
import {
    ChevronLeft,
    Plus,
    Globe,
    Loader2,
    Zap,
    History,
    Search
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios'

const Dashboard = () => {
    const [prompt, setPrompt] = useState("")
    const [websites, setWebsites] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)

    const fetchWebsites = async () => {
        try {
            const result = await axios.get('http://localhost:3002/gen/getWebsites', { withCredentials: true })
            setWebsites(result.data)
        } catch (error) {
            console.error("Fetch Websites Error:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWebsites()
    }, [])

    const handleGenerateWebsite = async () => {
        if (!prompt.trim() || generating) return;
        setGenerating(true)
        try {
            const result = await axios.post('http://localhost:3002/gen/Website', { prompt }, { withCredentials: true })
            if (result.data.websiteId) {
                navigate(`/editor/${result.data.websiteId}`)
            }
        } catch (error) {
            console.error("Generation Error:", error)
        } finally {
            setGenerating(false)
        }
    }

    const userData = useSelector(state => state.user.userData?.user)
    const navigate = useNavigate()

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="sticky z-40 top-0 backdrop-blur-2xl bg-white/10 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/10 transition">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className='text-xl font-bold'>Gamer <span className='text-zinc-400'>GPT</span></h1>
                    </div>
                    <button onClick={() => navigate('/generateweb')} className="px-4 py-2 rounded-lg bg-white text-black hover:scale-105 transition text-sm font-semibold flex items-center gap-2">
                        <Plus size={16} /> New Website
                    </button>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-10 flex justify-between items-end'>
                    <div>
                        <p className='text-sm mb-1 text-zinc-400'>Welcome Back</p>
                        <h1 className='text-3xl font-bold'>{userData.name}</h1>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                        <Zap size={16} className="text-yellow-500" />
                        <span className="text-sm font-bold">{userData.credits} Credits</span>
                    </div>
                </motion.div>
            </div>
            <div className='max-w-6xl mx-auto px-6 py-6'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-16'
                >
                    <h1 className='text-4xl md:text-5xl mb-5 font-bold leading-tight'>
                        Build websites with
                        <span className='block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>Real AI Power</span>
                    </h1>
                    <p className='text-zinc-400 max-w-2xl mx-auto'>
                        Describe your vision, and our AI will build a complete, responsive, multi-page website in seconds.
                    </p>
                </motion.div>
                <div className='mb-14'>
                    <div className="flex items-center gap-2 mb-6">
                        <Search size={20} className="text-purple-400" />
                        <h1 className='text-xl font-semibold'>What are we building today?</h1>
                    </div>
                    <div className='relative group'>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder='e.g. A modern dark-themed portfolio for a creative agency with a glassmorphism effect...'
                            className='w-full h-56 p-8 rounded-3xl bg-white/5 border border-white/10 outline-none resize-none text-base leading-relaxed focus:ring-2 focus:ring-purple-500/30 transition-all group-hover:border-white/20'
                        ></textarea>
                    </div>
                </div>
                <div className='flex justify-center'>
                    <motion.button
                        onClick={handleGenerateWebsite}
                        disabled={generating || !prompt.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='px-16 py-5 font-bold text-lg rounded-2xl text-black bg-white flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-white/5'>
                        {generating ? (
                            <>
                                <Loader2 className="animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Globe size={20} /> Generate Website
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Websites List */}
                <div className='mt-32'>
                    <div className="flex items-center gap-3 mb-10">
                        <History size={24} className="text-zinc-500" />
                        <h2 className='text-2xl font-bold'>Your Projects</h2>
                    </div>

                    {loading ? (
                        <div className='flex justify-center py-20'>
                            <Loader2 className='animate-spin h-10 w-10 text-white/20' />
                        </div>
                    ) : websites.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {websites.map((web) => (
                                <motion.div
                                    key={web._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -8 }}
                                    onClick={() => navigate(`/editor/${web._id}`)}
                                    className='p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-purple-500/20 transition-all cursor-pointer group'
                                >
                                    <div className="bg-[#0b0b0b] rounded-[22px] p-6 h-full border border-white/5 group-hover:border-white/20 transition-all">
                                        <div className='aspect-video mb-6 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden'>
                                            <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <Globe size={40} className="text-white/20 group-hover:text-purple-400/40 transition-colors" />
                                            </div>
                                        </div>
                                        <h3 className='font-bold text-lg mb-2 truncate'>{web.title}</h3>
                                        <div className="flex justify-between items-center">
                                            <p className='text-xs text-zinc-500 font-medium uppercase tracking-wider'>
                                                {new Date(web.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <div className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-zinc-400 border border-white/5">
                                                V1.0
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-32 rounded-[40px] border-2 border-dashed border-white/5 bg-white/[0.01]'>
                            <Globe size={48} className="mx-auto text-white/5 mb-6" />
                            <p className='text-zinc-500 font-medium'>No websites generated yet. Describe your idea above!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Dashboard