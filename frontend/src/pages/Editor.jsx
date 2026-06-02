import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Editor } from '@monaco-editor/react'
import {
    ChevronLeft,
    Code,
    Eye,
    Send,
    Rocket,
    Loader2,
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    Download,
    Save
} from 'lucide-react'

const WebEditor = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [website, setWebsite] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [saving, setSaving] = useState(false)
    const [view, setView] = useState('preview') // 'preview' or 'code'
    const [prompt, setPrompt] = useState("")
    const [showChat, setShowChat] = useState(true)
    const chatEndRef = useRef(null)

    const handleDownload = () => {
        if (!website?.latestCode) return
        const blob = new Blob([website.latestCode], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${website.title.replace(/\s+/g, '-').toLowerCase() || 'website'}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.post(`http://localhost:3002/gen/getWebsite/${id}`, {}, { withCredentials: true })
                setWebsite(result.data)
            } catch (error) {
                console.error("Error fetching website:", error)
            } finally {
                setLoading(false)
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        scrollToBottom()
    }, [website?.conversation])

    const handleUpdateWebsite = async () => {
        if (!prompt.trim() || updating) return
        setUpdating(true)
        try {
            const result = await axios.post(`http://localhost:3002/gen/update/${id}`, { prompt }, { withCredentials: true })
            if (result.data.success) {
                setWebsite(result.data.website)
                setPrompt("")
            }
        } catch (error) {
            console.error("Update Error:", error)
        } finally {
            setUpdating(false)
        }
    }

    const handleCodeChange = (newCode) => {
        setWebsite(prev => ({ ...prev, latestCode: newCode }))
    }

    const handleManualSave = async () => {
        if (saving) return
        setSaving(true)
        try {
            // We'll use a generic update endpoint or the same update endpoint with a special flag if needed
            // But for now, we just need to save the latestCode to the DB
            await axios.post(`http://localhost:3002/gen/update/${id}`, {
                prompt: "Manual code edit from editor",
                code: website.latestCode,
                manual: true
            }, { withCredentials: true })
        } catch (error) {
            console.error("Save Error:", error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
            <Loader2 className="animate-spin h-12 w-12 text-white" />
        </div>
    )

    if (!website) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Website not found</h1>
                <button onClick={() => navigate('/dashbord')} className="text-blue-400 hover:underline">Back to Dashboard</button>
            </div>
        </div>
    )

    return (
        <div className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden">
            {/* Toolbar */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashbord')} className="p-2 hover:bg-white/10 rounded-lg transition">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-sm font-semibold truncate max-w-[200px]">{website.title}</h1>
                        <p className="text-[10px] text-zinc-500">Gamer GPT AI Builder</p>
                    </div>
                </div>

                <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                    <button
                        onClick={() => setView('preview')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition ${view === 'preview' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                    >
                        <Eye size={16} /> Preview
                    </button>
                    <button
                        onClick={() => setView('code')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition ${view === 'code' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                    >
                        <Code size={16} /> Code
                    </button>
                </div>


                <div className="flex items-center gap-3">
                    <button
                        onClick={handleManualSave}
                        disabled={saving}
                        className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition flex items-center gap-2 text-xs"
                        title="Save Changes"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition flex items-center gap-2 text-xs"
                        title="Download Code"
                    >
                        <Download size={18} />
                    </button>
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className={`p-2 rounded-lg transition ${showChat ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        {showChat ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                    </button>
                    <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2">
                        <Rocket size={16} /> Deploy
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Chat Sidebar */}
                {showChat && (
                    <div className="w-80 border-r border-white/10 flex flex-col bg-[#080808] transition-all duration-300">
                        <div className="p-4 border-b border-white/10 flex items-center gap-2">
                            <MessageSquare size={18} className="text-purple-400" />
                            <h2 className="text-sm font-bold">AI Assistant</h2>
                        </div>

                        {/* Conversation History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {website.conversation?.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-tr-none'
                                        : 'bg-white/5 text-zinc-300 border border-white/10 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] text-zinc-600 mt-1 uppercase font-bold tracking-widest">
                                        {msg.role}
                                    </span>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <div className="relative">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Update your website..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pr-10 text-xs outline-none focus:ring-1 focus:ring-purple-500/50 resize-none h-20"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleUpdateWebsite()
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleUpdateWebsite}
                                    disabled={updating || !prompt.trim()}
                                    className="absolute right-2 bottom-2 p-1.5 bg-white text-black rounded-lg disabled:opacity-50 transition hover:scale-105"
                                >
                                    {updating ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                </button>
                            </div>
                            <p className="text-[9px] text-zinc-500 mt-2 text-center">
                                Each update costs 10 credits
                            </p>
                        </div>
                    </div>
                )}

                {/* Editor Content */}
                <div className="flex-1 relative">
                    {view === 'preview' ? (
                        <iframe
                            title="Website Preview"
                            srcDoc={website.latestCode}
                            className="w-full h-full border-none bg-white"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#1e1e1e]">
                            <Editor
                                srcDoc={website.latestCode}
                                height="100%"
                                defaultLanguage="html"
                                theme="vs-dark"
                                value={website.latestCode}
                                onChange={handleCodeChange}
                                options={{
                                    minimap: { enabled: true },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    automaticLayout: true,
                                    formatOnPaste: true,
                                    formatOnType: true
                                }}
                            />
                        </div>
                    )}

                    {updating && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                            <div className="bg-[#0b0b0b] p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4 shadow-2xl">
                                <Loader2 className="animate-spin h-10 w-10 text-purple-500" />
                                <div className="text-center">
                                    <h3 className="font-bold">Updating Website</h3>
                                    <p className="text-xs text-zinc-500 mt-1">AI is rewriting the code for you...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </div>
    )
}

export default WebEditor

