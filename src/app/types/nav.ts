export type NavLineSeg = { left: number; top: number; width: number; height: number };

export type NavLineBundle = {
  top: NavLineSeg;
  bottom: NavLineSeg;
  left: NavLineSeg;
  right: NavLineSeg;
};
