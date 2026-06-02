import generateResponse from '../config/openRouter.js'
import Website from '../models/website.model.js'
import extractJson from '../utils/extractjson.js'
import User from '../models/user.model.js'

const masterPromt = `
You are an expert senior frontend web developer and UI/UX engineer. Your job is to build a modern, high-converting, production-level premium SaaS/Startup website using ONLY semantic HTML5, modern CSS3 (Flexbox/Grid/Variables), and clean vanilla JavaScript. 

{USER_PROMPT}

### 🎨 PREMIUM DESIGN SYSTEM & UI/UX RULES
* Aesthetic: Sleek, high-end modern SaaS layout (dark/light hybrid with premium neon glassmorphism accents, smooth gradients, and sharp typography).
* Layout Structure: Implement a dynamic SPA-like (Single Page Application) multi-view router using vanilla JS, or a beautifully structured multi-section architecture so all views (Home, About, Services, Portfolio, Contact) feel like an expensive, seamless platform.
* Design Rules: Use large semantic paddings (e.g., section padding: 80px 0), modern card grids with subtle box-shadows, scale-up hover effects, and strict responsive break-points (Mobile, Tablet, Desktop).
* Typography: Use modern clean font stacks (e.g., Inter, Plus Jakarta Sans, or System UI fonts) with responsive font sizes using clamp() or rem.
* Vanilla JS Animations: Create a high-end JavaScript custom slider/carousel from scratch, custom scroll-driven reveal animations, and interactive functional tabs for changing views or portfolios.

### ⚙️ STRICT TECHNICAL RULES
* NO Frameworks, NO external libraries (No Tailwind, No Bootstrap, No jQuery, No GSAP).
* Use modern ES6+ features (const/let, arrow functions, Array methods like .map, .forEach, .filter, and textContent).
* The final code must include fully functional inline embedded <style> and <script> tags inside the HTML context.
* Use high-quality Unsplash source images matching the website's industry vertical.

### 🚨 OUTPUT CONSTRAINT (CRITICAL JSON RULES)
You MUST return ONLY a strictly formatted, valid JSON object. Do NOT wrap the JSON in markdown code blocks (\`\`\`json ... \`\`\`). Do NOT include any pre-text or post-text explanation. 

Return EXACTLY this JSON structure:
{
  "message": "web ready",
  "code": "<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n... FULL COMPACT MODERN CODE WITH INLINE STYLES AND SCRIPTS ...\\n</html>"
}
`
export const genrateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body
        if (!prompt) {
            return res.status(400).json({ message: "prompt is required" })
        }
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        if (user.credits < 50) {
            return res.status(400).json({ message: "you have no enough credits to generate Website" })
        }
        const finalPromt = masterPromt.replace("{USER_PROMPT}", prompt)
        let raw = "";
        let parsed = null

        for (let i = 0; i < 3 && !parsed; i++) {
            raw = await generateResponse(finalPromt)
            parsed = await extractJson(raw)
            if (!parsed && i === 1) {
                raw = await generateResponse(finalPromt + "\n\nRETURN ONLY RAW JSON")
                parsed = await extractJson(raw)
            }
        }

        if (!parsed || !parsed.code) {
            return res.status(400).json({ message: "AI returned invalid data, please try again" })
        }

        // ==================== SMART SLUG GENERATION (NEW) ====================
        const baseTitle = prompt.slice(0, 50); // Prompt ke shuru ke characters liye

        // 1. Text ko lowercase kiya, faltu characters hataye, aur spaces ko '-' se badla
        let generatedSlug = baseTitle
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Sirf alphanumeric aur spaces bachein
            .trim()
            .replace(/\s+/g, '-');        // Spaces ko hyphen mai badla

        // 2. Security Check: Agar prompt mai sirf urdu ya special symbols huwe toh slug khali ho jayega.
        // Us case mai ek default slug de do.
        if (!generatedSlug) {
            generatedSlug = "site";
        }

        // 3. Unique Check: Kyuki Schema mai 'unique: true' hai, isliye sath mai timestamp laga diya
        // Taaki agar user same prompt baar baar de, toh database error na aaye (e.g., "my-store-1716812345")
        const finalSlug = `${generatedSlug}-${Date.now()}`;
        // =====================================================================

        // Ab database mai save karte waqt 'slug' pass karein
        const website = await Website.create({
            user: user._id,
            title: prompt.slice(0, 60),
            latestCode: parsed.code,
            slug: finalSlug, // ✅ Ab validation pass ho jayegi!
            conversation: [
                {
                    role: "ai",
                    content: parsed.message || "Website generated"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
        })

        user.credits = user.credits - 50
        await user.save()

        return res.status(201).json({
            websiteId: website._id,
            remainingCredits: user.credits
        })
    } catch (error) {
        console.error("Generate Website Error:", error)
        return res.status(500).json({ message: `Generate website error: ${error.message}` })
    }
}

export const genrateDemo = async (req, res) => {
    try {
        const { prompt } = req.body
        const finalPromt = masterPromt.replace("{USER_PROMPT}", prompt || "a simple landing page")
        const result = await generateResponse(finalPromt)
        const data = await extractJson(result)
        return res.status(200).json(data)
    } catch (error) {
        console.error("Generate Demo Error:", error)
        return res.status(500).json({ message: error.message })
    }
}

export const website = async (req, res) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
            user: req.user._id
        })
        if (!website) {
            return res.status(404).json({ message: "Website not found" })
        }
        return res.status(200).json(website)
    } catch (error) {
        console.error("Get Website Error:", error)
        return res.status(500).json({ message: error.message })
    }
}

export const getWebsites = async (req, res) => {
    try {
        const websites = await Website.find({ user: req.user._id }).sort({ createdAt: -1 })
        return res.status(200).json(websites)
    } catch (error) {
        console.error("Get Websites Error:", error)
        return res.status(500).json({ message: error.message })
    }
}

export const changes = async (req, res) => {
    try {
        const { prompt, code, manual } = req.body
        const { id } = req.params

        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const website = await Website.findOne({ _id: id, user: user._id })
        if (!website) {
            return res.status(404).json({ message: "Website not found" })
        }

        // Handle manual save
        if (manual && code) {
            website.latestCode = code
            await website.save()
            return res.status(200).json({
                success: true,
                website,
                remainingCredits: user.credits
            })
        }

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" })
        }

        if (user.credits < 10) {
            return res.status(400).json({ message: "Not enough credits to update website (10 credits required)" })
        }

        const updatePrompt = `
        You are an expert senior frontend developer. Update the existing website code based on the user's request.
        
        CURRENT CODE:
        ${website.latestCode}
        
        USER REQUEST:
        ${prompt}
        
        ### 🚨 OUTPUT RULE (STRICT)
        1. You MUST return ONLY valid JSON.
        2. The "code" field MUST contain the COMPLETE, FULL, and READY-TO-USE HTML/CSS/JS code.
        3. NEVER use shortcuts like "// rest of the code" or "/* existing styles */". 
        4. If you omit even one line of existing code, the website will break. 
        5. Return the ENTIRE file every single time.
        
        {
          "message": "A short description of what was updated",
          "code": "FULL UPDATED HTML/CSS/JS CODE HERE"
        }
        
        * Do NOT add any explanation outside JSON.
        * Maintain the quality and responsiveness of the website.
        `

        let raw = "";
        let parsed = null

        for (let i = 0; i < 3 && !parsed; i++) {
            raw = await generateResponse(updatePrompt)
            parsed = await extractJson(raw)
            if (!parsed && i === 1) {
                raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON")
                parsed = await extractJson(raw)
            }
        }

        if (!parsed || !parsed.code) {
            return res.status(400).json({ message: "AI returned invalid data, please try again" })
        }

        website.latestCode = parsed.code
        website.conversation.push(
            { role: "user", content: prompt },
            { role: "ai", content: parsed.message || "Website updated successfully" }
        )

        await website.save()

        user.credits -= 10
        await user.save()

        return res.status(200).json({
            success: true,
            website,
            remainingCredits: user.credits
        })
    } catch (error) {
        console.error("Update Website Error:", error)
        return res.status(500).json({ message: `Update error: ${error.message}` })
    }
}

export const getAll = async (req, res) => {
    try {
        const allwebs = await Website.find({ user: req.user._id })
        return res.status(200).json(allwebs)
    } catch (error) {
        return res.status(500).json({ message: `all webs get error ${error}` })
    }
}
