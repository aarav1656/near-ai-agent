import { Message } from "ai";
import { useEffect, useState } from "react";
import { convertToUIMessages } from "../lib/chat";
import { fetchChatHistory } from "../lib/fetchChatHistory";
import { BitteAiChatProps, AgentConfig } from "../types/types";
import { AccountProvider } from "./AccountContext";
import { ChatContent } from "./chat/ChatContent";

export const BitteAiChat = ({
  colors,
  wallet,
  apiUrl,
  apiKey,
  historyApiUrl,
  agentId,
  agents,
  options,
  welcomeMessageComponent,
}: BitteAiChatProps & {
  agents?: AgentConfig[];
}) => {
  const [loadedData, setLoadedData] = useState({
    agentIdLoaded: "",
    uiMessages: [] as Message[],
  });

  const chatId =
    typeof window !== "undefined" && sessionStorage.getItem("chatId");

  const [activeAgents, setActiveAgents] = useState<Set<string>>(new Set([agentId]));

  useEffect(() => {
    const fetchData = async () => {
      if (chatId && historyApiUrl) {
        const chat = await fetchChatHistory(chatId, historyApiUrl);
        if (chat) {
          const uiMessages = convertToUIMessages(chat.messages);
          setLoadedData({
            agentIdLoaded: chat.agentId,
            uiMessages: uiMessages,
          });
        }
      }
    };

    fetchData();
  }, [chatId, historyApiUrl]);

  useEffect(() => {
    if (agentId) {
      setActiveAgents(new Set([agentId]));
    }
  }, [agentId]);

  const { agentIdLoaded, uiMessages } = loadedData;

  return (
    <AccountProvider wallet={wallet}>
      <ChatContent
        colors={colors}
        wallet={wallet}
        apiUrl={apiUrl}
        apiKey={apiKey}
        agentId={agentId ?? agentIdLoaded}
        agents={agents}
        activeAgents={activeAgents}
        onAgentJoin={(agentId) => setActiveAgents(prev => new Set([...prev, agentId]))}
        messages={uiMessages}
        options={{
          agentName: options?.agentName,
          agentImage: options?.agentImage,
          chatId: options?.chatId ?? (chatId || undefined),
          localAgent: options?.localAgent,
        }}
        welcomeMessageComponent={welcomeMessageComponent}
      />
    </AccountProvider>
  );
};
