
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import Features from './Features'
import NewNavbar from "./NewNavBar";
import AboutUs from "./AboutUs";
import { useEffect } from "react";
import Footer from "./Footer";
import ContactUs from "./ContactUs";
import HeroSection from "./HeroSection";
import Sponsor from "./Sponsor";
import Group from "./Group";
import { useGroup } from "../purchaseContext";



export default function HomeScreen() {
    const { ListOfGroup, } = useGroup();
    const [isLoading, setIsLoading] = useState(true)
    const [groupCreatedByOthers, setGroupsCreatedByOthers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
               const allGroups =  await ListOfGroup();
               
                    setGroupsCreatedByOthers(allGroups);
                    console.log(allGroups)

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }

        }
        fetchData();

    }, []);

    return (
        <div>
            <NewNavbar />
            {isLoading ? (
                <div className="flex justify-center items-center h-[50vh]">
                    <p className="text-gray-500 text-lg">Loading...</p>
                </div>) : <div>
                
                <HeroSection />
                <AboutUs />
                    <Group groupCreatedByOthers={groupCreatedByOthers} />
                    <Features/>
                <Sponsor />
                <ContactUs />
                
            </div>
            }
            <div className="max-md:pt-[50%] md:[20%]">
                <Footer />
            </div>
            
        </div>
    )
}
