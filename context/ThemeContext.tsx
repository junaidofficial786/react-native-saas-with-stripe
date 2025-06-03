// this file will provide light-dark theme
// theme manager for your React Native app. It handles switching between light and dark modes — including respecting system preferences — and persists the user's choice using the useStorageState hook

import React, {createContext, useContext, useEffect, useState} from 'react'
import {Appearance, useColorScheme} from 'react-native';
import {useStorageState} from '@/hooks/useStorageState'

type  ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeType; // User-selected theme preference
    currentTheme: 'light' | 'dark'; // Actual theme applied (after resolving 'system')
    setTheme: (theme: ThemeType) => void
}

// create a context with type of "ThemeContextType which is an object with theme, currentTheme and setTheme" 
const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    currentTheme: 'dark',
    setTheme: () => null,
});

export const useTheme = () => useContext(ThemeContext) // Custom hook to easily use the theme context in components.

// Wraps your app and provides theme values to all components.
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const systemColorScheme = useColorScheme() as 'light' | 'dark';
    const [[, storedTheme], setStoredTheme] = useStorageState('theme')
    const [theme, setThemeState] = useState<ThemeType>('system')
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark')

    // initialize theme from storage or default to system
    useEffect(() => {
        if (storedTheme) {
            setThemeState(storedTheme as ThemeType); // light/dark etc
        }
    }, [storedTheme]);

    // update current theme based on theme choice and system preference
    useEffect(() => {
        if (theme === 'system') {
            setCurrentTheme(systemColorScheme || 'dark')
        } else {
            setCurrentTheme(theme as 'light' | 'dark')
        }

    }, [theme, systemColorScheme])

    //listen for system theme changes
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme}) => {
            if (theme === 'system') {
                setCurrentTheme((colorScheme as 'light' | 'dark') || 'dark')
            }
        })

        return () => subscription.remove();

    }, [theme])

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme)
        setStoredTheme(newTheme)
    }

    return (
        <ThemeContext.Provider value={{theme, currentTheme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}