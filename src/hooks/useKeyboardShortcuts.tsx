import { useEffect } from "react"

export const useKeyboardShortcuts = (handler: (event: KeyboardEvent) => void, dependencies: unknown[]) => {
    useEffect(() => {
        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
    }, dependencies);
}

export const isModifierKey = (event: KeyboardEvent) => {
    return event.ctrlKey || event.metaKey;
}

export function isTypingTarget(event: KeyboardEvent): boolean {
    const target = event.target;
    return (
      target instanceof HTMLElement &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable)
    )
}

export function isModPlusKey(event: KeyboardEvent, key: string): boolean {
    return isModifierKey(event) && event.key.toLowerCase() === key.toLowerCase();
  }