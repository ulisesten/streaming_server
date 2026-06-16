const urlUsersSignin = '/api/v1/users/signin';

const funGetSigninRedirect = function() {
    const params = new URLSearchParams(window.location.search);
    const referer = params.get('redirect') || '/';
    try {
        const refererUrl = new URL(referer, window.location.origin);
        if (refererUrl.hostname === window.location.hostname) {
            return refererUrl.pathname + refererUrl.search;
        }
    } catch (e) {}
    return '/';
}
