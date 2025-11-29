import Footer from "../components/Footer";
import Header from "../components/Header";
import ProfileClient from "./ProfileClient";

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
    return (
        <>
            <Header />
            <ProfileClient />
            <Footer />
        </>
    );
}
