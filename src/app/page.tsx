import dynamic from "next/dynamic";

const AddUser = dynamic(() => import("@/components/AddUser"));

export default async function Home() {
  return (
    <div className="grid items-center justify-items-center  min-h-[calc(100vh-30px)] bg-gray-300 p-8 font-[family-name:var(--font-geist-sans)]">
      <AddUser />
    </div>
  );
}
