import { AUTO_REPLY_RULES, AUTO_REPLY_DEFAULT } from '../constants/chatConfig';

export const getAutoReplyText = (userMessage) => {
  const lower = userMessage.toLowerCase();
  const matched = AUTO_REPLY_RULES.find((rule) =>
    rule.keywords.some((kw) => lower.includes(kw))
  );
  return matched ? matched.reply : AUTO_REPLY_DEFAULT;
};