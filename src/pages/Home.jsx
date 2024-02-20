import mainLogo from "../assets/TPP_logo.png";

export default () => {
    return (<section className="page home">
        <h1>the playlist project</h1>
        <figure>
            <img src={mainLogo} alt="TPP logo" />
        </figure>
        <div>
            <h3>Create your tracks</h3>
            <h3>Create your playlists</h3>
            <h3>add tracks to your playlists</h3>
        </div>
    </section>
    )
}