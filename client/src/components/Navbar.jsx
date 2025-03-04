import { Book, LogOut, Menu, SchoolIcon, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import DarkMode from '@/DarkMode';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './ui/sheet';

import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await logoutUser();
    }


    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "User Logged Out");
            navigate("/login")
        }
    }, [isSuccess])

    return (
        <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            {/* {desktop} */}
            <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-2 h-full'>

                <div className='flex items-center gap-2'>
                    <SchoolIcon size={30} />
                    <Link to="/">
                    <h1 className='hidden md:block text-2xl font-bold'>ACADEMIX</h1>
                    </Link>
                   
                </div>

                {/* user icon and dark light mode icon */}
                <div className='items-center gap-8 flex'>
                    {
                        user ? (
                            <DropdownMenu>

                                <DropdownMenuTrigger asChild>
                                    <Avatar>
                                        <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-56">

                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>

                                        <DropdownMenuItem>
                                            <Book />
                                            <span><Link to="my-learning">My Learning</Link></span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem>
                                            <User />
                                            <span><Link to="profile">Edit Profile</Link></span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem>
                                            <LogOut />
                                            <span onClick={logoutHandler}>Log out</span>
                                        </DropdownMenuItem>

                                    </DropdownMenuGroup>
                                    {
                                        user?.role === "instructor" && (
                                            <>
                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem className="flex justify-center items-center">
                                                    <Button variant="outline" className="w-48" onClick={()=>navigate("/admin/dashboard")}>Dashboard</Button>
                                                </DropdownMenuItem>

                                            </>
                                        )
                                    }

                                </DropdownMenuContent>

                            </DropdownMenu>
                        ) : (
                            <div className="flex gap-2 items-center">
                                <Button variant="outline" onClick={() => { navigate("/login") }}>Login</Button>
                                <Button onClick={() => { navigate("/login") }}>SignUp</Button >
                            </div>
                        )

                    }
                    <DarkMode />

                </div>

            </div>

            {/* Mobile Device */}
            <div className='flex md:hidden justify-between items-center px-4 h-full'>
                <h1 className='text-2xl font-bold'><Link to="/">ACADEMIX</Link></h1>
                <MobileNavbar />
            </div>


        </div>
    )
}

export default Navbar;

const MobileNavbar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
   

    const logoutHandler = async () => {
        await logoutUser();
    }


    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "User Logged Out");
            navigate("/login")
        }
    }, [isSuccess])
   
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="rounded-full bg-gray-200 dark:bg-blue-900 hover:bg-gray-500 " variant="outline">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle><Link to="/">ACADEMIX</Link></SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <Separator className='mr-2' />
                <nav className='flex flex-col space-y-4'>
                    <Link to="my-learning">My Learning</Link>
                    <Link to="profile">Edit Profile</Link>
                    <p onClick={logoutHandler}>Log Out</p>
                </nav>
                {
                    user?.role === "instructor" && (
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit" onClick={()=> navigate("/admin/dashboard")}>Dashboard</Button>
                            </SheetClose>
                        </SheetFooter>
                    )
                }

            </SheetContent>
        </Sheet>
    )
}