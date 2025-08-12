import SideBar from "./sideBar";

export default function NavBar() {
  return (
    <div className="relative w-full h-full flex flex-col bg-gray-200">
      <main className="px-6 pt-30 pb-18 w-full h-full flex flex-raw justify-between items-center overflow-y-auto scrollbar-hide scroll-smooth">
        <p>NestOn</p>
      </main>
    </div>
  );
}
