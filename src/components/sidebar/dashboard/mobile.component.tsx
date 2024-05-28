import { FiMenu as Icon } from "react-icons/fi";

// Burgermenu for mobile

export default function MenuBarMobile({ setter }: any) {
  return (
    <nav className="md:hidden z-20 h-[60px] bg-gray-400 dark:bg-gray-700 flex [&>*]:my-auto px-2">
      <button
        className="flex text-4xl text-white"
        onClick={() => {
          setter((oldVal: any) => !oldVal);
        }}
      >
        <Icon />
      </button>
    </nav>
  );
}
