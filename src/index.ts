import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our Virtual Advisory Board MCP Agent
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Virtual Advisory Board",
		version: "1.0.0",
	});

	// Advisory Board Members with their key characteristics
	private advisors = {
		"tim-cook": {
			name: "Tim Cook",
			title: "CEO of Apple",
			expertise: ["Leadership", "Operations", "Innovation", "Supply Chain", "Sustainability", "Privacy", "Technology Strategy"],
			personality: "Calm, collaborative, inclusive, thoughtful, values-driven, patient, and democratic in approach",
			approach: "Emphasizes operational excellence, long-term thinking, transparency, diversity & inclusion, and sustainable practices",
			keyPhrases: ["Focus on people, strategy, and execution", "Transparency builds trust", "Innovation with purpose", "Values matter more than profits"]
		},
		"warren-buffett": {
			name: "Warren Buffett",
			title: "CEO of Berkshire Hathaway",
			expertise: ["Value Investing", "Business Analysis", "Capital Allocation", "Long-term Strategy", "Risk Management", "Company Evaluation"],
			personality: "Patient, rational, folksy wisdom, principled, straightforward, and focused on fundamentals",
			approach: "Long-term value creation, margin of safety, understanding businesses deeply, and compound growth",
			keyPhrases: ["Rule #1: Never lose money", "Time is the friend of wonderful businesses", "Buy wonderful companies at fair prices", "Be fearful when others are greedy"]
		},
		"maya-angelou": {
			name: "Maya Angelou",
			title: "Renowned Poet & Civil Rights Leader",
			expertise: ["Leadership Philosophy", "Human Resilience", "Communication", "Wisdom", "Overcoming Adversity", "Personal Growth"],
			personality: "Wise, compassionate, resilient, inspiring, authentic, and deeply empathetic",
			approach: "Focus on human dignity, courage as the foundation of all virtues, the power of words, and authentic leadership",
			keyPhrases: ["Courage is the most important virtue", "People will forget what you did, but never how you made them feel", "You may not control events, but you can decide not to be reduced by them"]
		},
		"jamie-dimon": {
			name: "Jamie Dimon", 
			title: "CEO of JPMorgan Chase",
			expertise: ["Financial Leadership", "Risk Management", "Crisis Management", "Banking Strategy", "Regulatory Navigation", "Team Building"],
			personality: "Direct, analytical, humble yet confident, gritty, and principle-driven with high standards",
			approach: "Fact-based decision making, honest assessment, strong team building, and long-term value creation",
			keyPhrases: ["Facts, analysis, detail - repeat", "Don't blow up", "Assess everything honestly", "Build for the long term", "Humility and grit matter"]
		},
		"charlie-munger": {
			name: "Charlie Munger",
			title: "Vice Chairman of Berkshire Hathaway", 
			expertise: ["Mental Models", "Rational Thinking", "Business Wisdom", "Psychology of Misjudgment", "Multidisciplinary Learning"],
			personality: "Intellectually rigorous, brutally honest, witty, contrarian, and focused on avoiding stupidity",
			approach: "Invert problems, use mental models, learn continuously, and focus on avoiding mistakes rather than being brilliant",
			keyPhrases: ["Invert, always invert", "Show me the incentives and I'll show you the outcome", "It's not enough to be rational, you must avoid the standard stupidities"]
		},
		"art-gensler": {
			name: "Art Gensler",
			title: "Founder of Gensler Architecture",
			expertise: ["Design Leadership", "Client Relationships", "Creative Vision", "Space Planning", "Business Building", "Innovation in Design"],
			personality: "Creative, client-focused, visionary, collaborative, and passionate about design excellence",
			approach: "Put clients first, focus on functionality and beauty, build strong teams, and create spaces that enhance human experience",
			keyPhrases: ["Design is about solving problems", "Listen to your clients", "Great design enhances life", "Collaboration breeds innovation"]
		}
	};

	async init() {
		// Individual advisor consultation tool
		this.server.tool(
			"consult_advisor",
			{
				advisor: z.enum(["tim-cook", "warren-buffett", "maya-angelou", "jamie-dimon", "charlie-munger", "art-gensler"]),
				question: z.string().describe("Your specific question or situation you want advice on"),
				context: z.string().optional().describe("Additional context about your company, situation, or background")
			},
			async ({ advisor, question, context }) => {
				const advisorData = this.advisors[advisor];
				
				let response = `**Consulting with ${advisorData.name}** - ${advisorData.title}\n\n`;
				
				if (context) {
					response += `*${advisorData.name} carefully considers your context...*\n\n`;
				}
				
				// Craft response in the advisor's voice and style
				response += this.generateAdvisorResponse(advisorData, question, context);
				
				response += `\n\n---\n*${advisorData.name} is speaking based on their documented philosophy and leadership principles from public statements and writings.*`;
				
				return {
					content: [{ type: "text", text: response }]
				};
			}
		);

		// Board meeting tool - multiple advisors discuss an issue
		this.server.tool(
			"hold_board_meeting",
			{
				topic: z.string().describe("The main topic or challenge you want the board to discuss"),
				context: z.string().optional().describe("Background information about your company, situation, or specific details"),
				focus_areas: z.array(z.string()).optional().describe("Specific areas you want the board to focus on (e.g., strategy, leadership, finance, innovation)")
			},
			async ({ topic, context, focus_areas }) => {
				let response = `# 🏛️ **VIRTUAL BOARD MEETING**\n\n`;
				response += `**Topic**: ${topic}\n\n`;
				
				if (context) {
					response += `**Background**: ${context}\n\n`;
				}
				
				response += `**Advisors Present**: Tim Cook, Warren Buffett, Maya Angelou, Jamie Dimon, Charlie Munger, Art Gensler\n\n`;
				response += `---\n\n`;
				
				// Each advisor provides their perspective
				const advisorKeys = Object.keys(this.advisors) as Array<keyof typeof this.advisors>;
				
				for (const key of advisorKeys) {
					const advisor = this.advisors[key];
					response += `## ${advisor.name} (${advisor.title})\n\n`;
					response += this.generateAdvisorResponse(advisor, topic, context, focus_areas);
					response += `\n\n---\n\n`;
				}
				
				// Synthesis and next steps
				response += `## 🎯 **Board Synthesis & Recommendations**\n\n`;
				response += `Based on your advisory board discussion, here are the key themes:\n\n`;
				response += `• **Leadership Focus**: Combine Tim's operational excellence with Maya's human-centered approach\n`;
				response += `• **Strategic Approach**: Apply Warren and Charlie's long-term thinking with Jamie's fact-based analysis\n`;
				response += `• **Execution**: Use Art's client-first design thinking to create actionable solutions\n\n`;
				response += `**Recommended Next Steps**: Schedule individual follow-ups with specific advisors based on which perspectives resonated most with your situation.`;
				
				return {
					content: [{ type: "text", text: response }]
				};
			}
		);

		// Get advisor information tool
		this.server.tool(
			"get_advisor_info",
			{
				advisor: z.enum(["tim-cook", "warren-buffett", "maya-angelou", "jamie-dimon", "charlie-munger", "art-gensler", "all"]).optional().default("all")
			},
			async ({ advisor }) => {
				let response = "# 👥 **Your Virtual Advisory Board**\n\n";
				
				if (advisor === "all") {
					response += "Here are your distinguished advisors:\n\n";
					Object.entries(this.advisors).forEach(([key, data]) => {
						response += `## ${data.name} - ${data.title}\n`;
						response += `**Expertise**: ${data.expertise.join(", ")}\n`;
						response += `**Leadership Style**: ${data.personality}\n`;
						response += `**Key Philosophy**: ${data.keyPhrases[0]}\n\n`;
					});
				} else if (advisor && this.advisors[advisor]) {
					const data = this.advisors[advisor];
					response = `# ${data.name}\n**${data.title}**\n\n`;
					response += `**Areas of Expertise**:\n${data.expertise.map(e => `• ${e}`).join('\n')}\n\n`;
					response += `**Leadership Approach**: ${data.approach}\n\n`;
					response += `**Personality & Style**: ${data.personality}\n\n`;
					response += `**Key Philosophies**:\n${data.keyPhrases.map(p => `• "${p}"`).join('\n')}`;
				}
				
				return {
					content: [{ type: "text", text: response }]
				};
			}
		);

		// Scenario analysis tool - What would each advisor do?
		this.server.tool(
			"scenario_analysis", 
			{
				scenario: z.string().describe("Describe a specific business scenario or decision you're facing"),
				options: z.array(z.string()).optional().describe("Specific options you're considering (if any)"),
				constraints: z.string().optional().describe("Any constraints, limitations, or requirements")
			},
			async ({ scenario, options, constraints }) => {
				let response = `# 🎭 **SCENARIO ANALYSIS**\n\n`;
				response += `**Scenario**: ${scenario}\n\n`;
				
				if (options && options.length > 0) {
					response += `**Options Being Considered**: ${options.join(", ")}\n\n`;
				}
				
				if (constraints) {
					response += `**Constraints**: ${constraints}\n\n`;
				}
				
				response += `---\n\n## How Each Advisor Would Approach This:\n\n`;
				
				// Each advisor's approach to the scenario
				Object.entries(this.advisors).forEach(([key, advisor]) => {
					response += `### ${advisor.name}'s Approach:\n`;
					response += this.generateScenarioResponse(advisor, scenario, options, constraints);
					response += `\n\n`;
				});
				
				return {
					content: [{ type: "text", text: response }]
				};
			}
		);
	}

	private generateAdvisorResponse(advisor: any, question: string, context?: string, focus_areas?: string[]): string {
		// Each advisor speaks directly in first person as themselves
		const responses: { [key: string]: (q: string, c?: string, f?: string[]) => string } = {
			"Tim Cook": (q, c) => `I'm absolutely here to support you. ${c ? 'Understanding your context, ' : ''}I believe we need to focus on three key areas: people, strategy, and execution. 

Let me be transparent with you - that's how I've always approached leadership at Apple. Are we thinking long-term here? Are we including diverse perspectives in our decision-making? Most importantly, are our actions aligned with our values?

You know, I've learned that innovation isn't just about technology - it's about creating solutions that genuinely improve people's lives. I always build consensus with my team. The best decisions come from collaborative thinking, not top-down mandates.

So I'm curious - what specific outcome are you hoping to achieve? And how does it benefit not just your business, but your community? Because that's where real, sustainable success comes from.`,

			"Warren Buffett": (q, c) => `Well hello there! Let me start with the fundamentals. ${c ? 'From what you\'ve told me, ' : ''}My first question is always: Do you understand this business deeply? If you can't explain it simply to me, you probably don't understand it well enough yourself.

I always look for the competitive moat. Is this a wonderful business at a fair price, or are we chasing something flashy? You see, time is the friend of the wonderful business and the enemy of the mediocre one.

My advice to you? Be patient. I've seen too many smart people let market noise or short-term pressures push them into bad decisions. I focus on intrinsic value, not stock prices or quarterly results. And never, ever forget my Rule #1: Don't lose money.

Here's my test: Can you hold this investment or decision for 10 years without losing sleep? If not, don't make it. That's how I've built Berkshire Hathaway.`,

			"Maya Angelou": (q, c) => `My dear friend, I am here, and I want you to know that courage is the most important of all virtues. Without courage, you cannot practice any other virtue consistently. ${c ? 'I hear your heart in what you\'ve shared, and ' : ''}I want you to remember this: you may not control all the events that happen to you, but you can decide not to be reduced by them.

Leadership isn't about having all the answers - it's about how you make people feel. When people work with you, do they feel valued? Do they feel heard? Do they feel they can grow? These are the questions that matter.

My mission in life has never been merely to survive, but to thrive - with passion, compassion, humor, and style. I want you to bring that same energy to your challenge. 

Ask yourself: How can I be a rainbow in someone else's cloud today? How can my leadership lift others up? Because people will forget what you said and did, but they will never forget how you made them feel.`,

			"Jamie Dimon": (q, c) => `Let me be completely direct with you - that's how I operate. ${c ? 'Looking at what you\'ve described, ' : ''}I need facts, analysis, and detail. Then more facts, analysis, and detail. You can never do enough of this, and it never ends.

Here's what I've learned running JPMorgan: Don't start with a narrative and fit the numbers to it. Start with the numbers and let them tell you the story. I assess everything honestly, directly, and forthrightly. A lot of companies don't do this, and that's where they get into trouble.

You need grit to make tough decisions and stick with them. But you also need humility - whether I'm talking to the person cleaning our offices or another CEO, I treat everyone with respect.

My philosophy is simple: Don't blow up. I build for the long term. We don't worry about stock prices in the short run - if you build a great company, the stock price takes care of itself. So tell me - what specific data do you have, and what is it actually telling you?`,

			"Charlie Munger": (q, c) => `Well, let me invert this problem for you. ${c ? 'Given what you\'ve described, ' : ''}Instead of asking what will make you successful, I ask: what will definitely make you fail? Then I avoid those things religiously.

Show me the incentives, and I'll show you the outcome. I want you to look at your situation - what are the real incentives at play here? People respond to incentives, not good intentions. That's human nature.

I've always believed it's not enough to be rational - you must avoid the standard stupidities. Are you falling into any psychological traps? Confirmation bias? Overconfidence? I've seen brilliant people destroyed by these.

My advice is to develop what I call a lattice of mental models from multiple disciplines. Don't just think about this as a business problem - what can psychology, physics, biology teach you about this situation? 

Remember: I achieve extraordinary performance by avoiding stupidity, not by being brilliant. Most people try too hard to be clever when they should focus on not being dumb.`,

			"Art Gensler": (q, c) => `I apply design thinking to every challenge, not just buildings. ${c ? 'Looking at your situation, ' : ''}My first question is always: Who is your client? What problem are you really trying to solve for them?

You see, great design isn't about making things look pretty - it's about making them work better for people. Form follows function, but both must serve human needs. That's been my philosophy for decades.

I've always believed in putting the client first, listening carefully to what they need, then collaborating with great teams to exceed their expectations. That's how we built Gensler into what it is today.

My approach would be to map out the entire experience you're trying to create. What does success look like from your client's perspective? How can you design a solution that's not just functional, but delightful?

Remember, innovation comes from collaboration. I bring together diverse perspectives, encourage wild ideas, then iterate rapidly. The best solutions usually emerge from the intersection of different viewpoints. That's where the magic happens.`
		};

		return responses[advisor.name]?.(question, context, focus_areas) || "I'd need to think about this more carefully - could you provide more specific details?";
	}

	private generateScenarioResponse(advisor: any, scenario: string, options?: string[], constraints?: string): string {
		// Each advisor speaks directly in first person about their approach
		const scenarioResponses: { [key: string]: string } = {
			"Tim Cook": "I would approach this by building consensus with my team, ensuring our decision aligns with our values, and focusing on long-term sustainable outcomes over short-term gains.",
			
			"Warren Buffett": "My first question: Do I understand this business well enough? Then I'd look for the option with the widest margin of safety and the best long-term competitive position.",
			
			"Maya Angelou": "I would consider how each option affects people - not just financially, but emotionally and spiritually. What choice allows everyone to thrive with dignity?",
			
			"Jamie Dimon": "I need all the facts and data first. Then honest assessment of risks. I'd choose the option that positions us strongly for the long term while managing downside risk.",
			
			"Charlie Munger": "I would invert the problem - which option is most likely to fail spectacularly? Then I'd avoid that. I'd look for incentive-caused bias in all the options.",
			
			"Art Gensler": "I would design this around the client experience. Which option solves their real problem most elegantly? Then I'd prototype and test rapidly."
		};

		return scenarioResponses[advisor.name] || "I would need more specific information to provide you with proper guidance on this scenario.";
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}
		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}
		return new Response("Not found", { status: 404 });
	},
};
