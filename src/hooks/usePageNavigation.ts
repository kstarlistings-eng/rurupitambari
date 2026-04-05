import { useQueryState } from "nuqs";

export function usePageNavigation(limit = 8) {
  const [offset, setOffset] = useQueryState("offset", {
    defaultValue: 0,
    parse: Number,
  });

  const goBack = () => {
    setOffset(Math.max(offset - limit, 0));
  };
  const goForward = () => {
    setOffset(offset + limit);
  };
  const pageReset = () => {
    setOffset(0);
  };

  return { goBack, offset, goForward, pageReset };
}
