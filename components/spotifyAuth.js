import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, } from '@env';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
export const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

  export async function refreshAccessToken() {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
  
    if (refreshToken) {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + base64.encode(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET),
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      });
  
      const data = await response.json();
  
      if (data.access_token) {
        await AsyncStorage.setItem('accessToken', data.access_token);
        return data.access_token;
      } else {
        throw new Error('Failed to refresh access token');
      }
    } else {
      throw new Error('No refresh token available');
    }
  }
  
  export function useSpotifyAuth() {
    const redirectUri = makeRedirectUri({
      native: 'companionai://spotify-callback',
    });
  
    const [request, response, promptAsync] = useAuthRequest(
      {
        clientId: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET,
        scopes: ['user-read-private', 'playlist-modify-public', 'user-modify-playback-state'],
        redirectUri,
        usePKCE: false,
      },
      discovery
    );
  
    useEffect(() => {
        if (response?.type === 'success') {
          const { code } = response.params;
      
          // Exchange the authorization code for an access token
          fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + base64.encode(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET),
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            // Store the access token and refresh token
            AsyncStorage.setItem('accessToken', data.access_token);
            AsyncStorage.setItem('refreshToken', data.refresh_token);
          })
          .catch(error => console.error(error));
        }
      }, [response]);
  
    return { request, response, promptAsync };
  }