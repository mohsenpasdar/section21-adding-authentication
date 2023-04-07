import React, { useEffect } from 'react';
import { Outlet, useLoaderData, useNavigation, useSubmit } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation'
import { getTokenDuration } from '../util/auth';

const RootLayout = () => {
    // const navigation = useNavigation()
    const token = useLoaderData()
    const submit = useSubmit()

    useEffect(() => {
        if (!token) {
            return
        }

        if (token === 'EXPIRED') {
            submit(null, { action: '/logout', method: 'POST'})
            return
        }

        const tokenDuration = getTokenDuration();
        console.log(tokenDuration);

        setTimeout(() => {
            submit(null, { action: '/logout', method: 'POST'})
        }, tokenDuration);
    }, [token])

    return (
        <>
            <MainNavigation />
            <main>
                {/* {navigation.state === 'loading' ? <p>loading...</p> : ''} */}
                <Outlet />
            </main>
        </>
    );
};

export default RootLayout;