export const AUTO_REPLY_ENABLED = true;

export const AUTO_REPLY_DELAY_MS = 2500;

export const SUPPORT_NAME = 'Plant Support';
export const SUPPORT_ONLINE = true;

export const AUTO_REPLY_RULES = [
    {
        keywords: ['hi', 'hello', 'hey'],
        reply: "Hi there! 👋 How can I help you with your plants today?",
    },
    {
        keywords: ['order', 'delivery', 'shipping', 'track'],
        reply:
        "You can check your order status anytime in the History tab. Is there a specific order you're asking about?",
    },
    {
        keywords: ['price', 'cost', 'discount', 'offer'],
        reply:
        'Good question! Check the Special Offers section on Home for current discounts — happy to help you find something in your budget too.',
    },
    {
        keywords: ['water', 'care', 'sunlight', 'light', 'dying', 'yellow', 'brown'],
        reply:
        "Plant trouble? Most issues come down to overwatering or the wrong light. Tell me which plant and what you're seeing, and I'll help you sort it out.",
    },
    {
        keywords: ['return', 'refund', 'cancel'],
        reply: "No worries — let me know your order number and I'll look into a return or refund for you.",
    },
    {
        keywords: ['thanks', 'thank you'],
        reply: "You're very welcome! 🌿 Let me know if anything else comes up.",
    },
];

// Used when no rule above matches the user's message.
export const AUTO_REPLY_DEFAULT =
    'Thanks for reaching out! Our team will get back to you shortly — in the meantime, feel free to browse the shop.';