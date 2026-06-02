import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiFillLeftCircle } from "react-icons/ai";
import { motion } from "motion/react";

const GenerateWeb = () => {
    const userData = useSelector(state => state.user.userData?.user)
    const navigate = useNavigate()

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="sticky z-40 top-0 backdrop-blur-2xl bg-white/10 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/10 transition">
                            <AiFillLeftCircle size={30} />
                        </button>
                        <h1 className="text-xl font-bold">Gamer <span className="text-zinc-400">GPT</span></h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-400">Credits: {userData.credits}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                    <h1 className="text-4xl font-bold mb-6">Coming Soon</h1>
                    <p className="text-zinc-400 mb-8">
                        The Advanced Website Generation dashboard is under development.
                        Please use the quick generation tool on the Dashboard page.
                    </p>
                    <button
                        onClick={() => navigate('/dashbord')}
                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition"
                    >
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
export default GenerateWeb
