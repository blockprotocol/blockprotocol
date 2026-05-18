/**
 * The Block Protocol site no longer ships an account system, so every visitor
 * is treated as "other" when looking at a profile page. The hook is kept so
 * existing call sites continue to compile.
 */
export const useUserStatus = (): "loading" | "current" | "other" => "other";
