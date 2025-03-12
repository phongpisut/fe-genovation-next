import Cookies from 'js-cookie';
import { createClient } from '@supabase/supabase-js';

const TOKEN = "supabase_token"
const REFRESH_TOKEN = "supabase_refresh_token"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const setAuthCookies = async(access_token: string = "", refresh_token:string = "") => {
    await Cookies.set(TOKEN,  access_token|| '', { expires: 7 }); 
    await Cookies.set(REFRESH_TOKEN, refresh_token || '', { expires: 30 });
}

export const logOut = async()=> {
    await supabase.auth.signOut();
    await Cookies.remove(TOKEN);
    await Cookies.remove(REFRESH_TOKEN);
}

export const refreshToken = ()=> new Promise(async (resolve, reject)=>{
    const refresh_token = Cookies.get(REFRESH_TOKEN)
    const {data , error} = await supabase.auth.refreshSession({
        refresh_token: refresh_token || ''
    })
    if(error) return reject(error?.message);
    resolve(data.session);
})
