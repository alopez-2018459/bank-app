import React from 'react';
import NavBar from './components/NavBar';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if(!session?.user?.username){
    redirect("/auth/Login")
  }

  if(session?.user?.role != "admin"){
    redirect("/console")
  }

  return (
    <section>
      <NavBar/>
      <div className="bg-violet-50 h-screen">{children}</div>
    </section>
  );
}