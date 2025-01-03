import clsx from "clsx";
import ToggleLabel from "./ToggleLabel";

interface IToggleSwitchProps {
  isChecked: boolean;
  labelLeft: string;
  labelRight: string;
  onToggle: () => void;
}

const Switch = ({
  isChecked,
  labelLeft,
  labelRight,
  onToggle,
}: IToggleSwitchProps) => {
  return (
    <div
      className="relative flex items-center h-10 w-40 bg-gray-400 rounded-full p-1 cursor-pointer"
      onClick={onToggle}
    >
      <div
        className={clsx(
          "absolute h-8 w-[48%] rounded-full bg-black transition-transform",
          isChecked ? "translate-x-full" : "translate-x-0"
        )}
      />

      <ToggleLabel isActive={!isChecked}>{labelLeft}</ToggleLabel>
      <ToggleLabel isActive={isChecked}>{labelRight}</ToggleLabel>
    </div>
  );
};

export default Switch;
