import { useStudyStore } from "../../../study/StudyModel";
import { useModelStore } from "../../Model";
import { TextUtils } from "../../utils/TextUtils";
import { PromptTool } from "./PromptTool";

export class TextPrompter extends PromptTool<string, string, string> {
    previousText: string;
    followingText: string;

    constructor(originalText: string, previousText: string, followingText: string) {
        super(originalText);
        this.previousText = previousText;
        this.followingText = followingText;
    }

    execute(action : string): Promise<string> {
        useStudyStore.getState().logEvent("PROMPT_TOOL_EXECUTED", { className: this.constructor.name, input: this.input, parameters: action });

        const prompt = `${this.previousText} <blank> ${this.followingText}
<blank>: ${this.input}

INSTRUCTION: ${action}
Rewrite <blank>. Follow INSTRUCTION
<blank>:`

        return useModelStore.getState().executePrompt({ prompt: prompt }).then(result => {
            const newText = TextUtils.getFittingString(result.result.replace("<blank>:", "").replace("<blank>", ""), this.input);
            return newText;
        });
    }
}