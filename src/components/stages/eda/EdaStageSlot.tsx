"use client";

import type { EdaStageConfig } from "@/lib/lessons/eda/types";
import { EdaEventStage } from "@/components/stages/EdaEventStage";
import { EdaMessageFlowStage } from "@/components/stages/eda/EdaMessageFlowStage";
import { EdaBrokersCompareStage } from "@/components/stages/eda/EdaBrokersCompareStage";
import { EdaDlqSimStage } from "@/components/stages/eda/EdaDlqSimStage";
import { EdaCqrsSplitStage } from "@/components/stages/eda/EdaCqrsSplitStage";
import { EdaSourcingTimelineStage } from "@/components/stages/eda/EdaSourcingTimelineStage";
import { EdaEcstPayloadStage } from "@/components/stages/eda/EdaEcstPayloadStage";
import { EdaTradeoffsStage } from "@/components/stages/eda/EdaTradeoffsStage";

export function EdaStageSlot({ stage }: { stage: EdaStageConfig }) {
  switch (stage.kind) {
    case "eda-bus":
      return <EdaEventStage />;
    case "message-flow":
      return (
        <EdaMessageFlowStage
          jsonPreview={stage.jsonPreview}
          serverHint={stage.serverHint}
          brokerHint={stage.brokerHint}
          clientHint={stage.clientHint}
        />
      );
    case "brokers-compare":
      return <EdaBrokersCompareStage />;
    case "dlq-sim":
      return <EdaDlqSimStage />;
    case "cqrs-split":
      return <EdaCqrsSplitStage />;
    case "sourcing-timeline":
      return <EdaSourcingTimelineStage />;
    case "ecst-payload":
      return <EdaEcstPayloadStage />;
    case "tradeoffs-interactive":
      return <EdaTradeoffsStage />;
    case "none":
      return (
        <div className="flex h-full min-h-[160px] items-center justify-center px-4 text-center text-sm text-zinc-500">
          Per questo argomento il focus è su diagramma, contratto CloudEvents e note: scorri verso il basso.
        </div>
      );
  }
}
