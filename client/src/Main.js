import NewArtists from "./NewArtists";
import TagsMain from "./TagsMain";
import FeaturedArtists from "./FeaturedArtists";

export default function Main({
    first,
    last,
    bio,
    onBioUpload,
    profile_picture_url,
    openModal,
    isConnected,
    openLoginModal,
}) {
    return (
        <div className="mainWrapper">
            <FeaturedArtists isConnected={isConnected} />
            <NewArtists isConnected={isConnected}></NewArtists>
            <TagsMain isConnected={isConnected}></TagsMain>
            {/* <Footer /> */}
        </div>
    );
}
