
const funEsSmartTV = function() {
    const ua = navigator.userAgent;
    const tvPatterns = [
        /SmartHub/i, /SMART-TV/i, /HbbTV/i, /NetCast/i,
        /Tizen/i, /webOS/i, /DuckDuckGo-SSB/i,
        /Viera/i, /Bravia/i, /AFT/i, /AFTS/i, /AFTM/i,
        /Roku/i, /CrKey/i, /AppleTV/i, /tvOS/i,
        /Xbox/i, /PLAYSTATION/i, /Nintendo/i,
        /Android TV/i, /Android\/[0-9]+.*\s\(.*TV/i,
        /Opera TV Store/i, /Opera\/9.80.*Linux/i,
        /Hisense/i, /Changhong/i, /Skyworth/i, /TCL/i
    ];
    if (tvPatterns.some(p => p.test(ua))) return true;

    if (/Android/i.test(ua) && !/Mobile/i.test(ua) && !/Tablet/i.test(ua)) {
        const screenArea = screen.width * screen.height;
        if (screenArea >= 1920 * 1080) return true;
    }

    if (screen.width >= 1920 && !/Mobile|Tablet|iPhone|iPad|iPod/i.test(ua)) {
        if ('ontouchstart' in window && !window.chrome?.runtime) return true;
    }

    return false;
};

document.addEventListener("DOMContentLoaded", async () => {
    if (funEsSmartTV()) {
        const search = window.location.search;
        window.location.replace(`/tv${search}`);
        return;
    }
    funCargarInfoUsuario((data) => {
        Gb.getComponent('header.home').setUserValues(
            data.usu_thumbnail || url_miniatura_default,
            data.usu_nombre,
            data.usu_id
        ); 
    });
    funCargarFeed();
    
});