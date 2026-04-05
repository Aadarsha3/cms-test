import { useMemo, type ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { useTheme } from './ChosenTheme'
import { CssBaseline } from '@mui/material'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { theme } = useTheme()

    // Resolve "system" preference to actual mode
    const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)')
    const resolvedMode = useMemo(() => {
        if (theme === 'system') return systemPrefersDark ? 'dark' : 'light'
        return theme
    }, [theme, systemPrefersDark])

    const muiTheme = useMemo(() => createThemeHelper(resolvedMode), [resolvedMode])

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    )
}

const brandColorLight = '#243F76'
const brandColorDark = '#4897D8' // Improved dark mode primary blue

export const createThemeHelper = (mode: 'dark' | 'light') => {
    const isDark = mode === 'dark'
    return createTheme({
        palette: {
            mode,
            background: {
                default: isDark ? '#191919' : '#f2f4f7',
                paper: isDark ? '#242424' : '#ffffff',
            },
            primary: {
                main: isDark ? brandColorDark : brandColorLight,
                light: isDark ? '#0576c7' : brandColorDark,
            },
            error: {
                main: 'rgb(232, 51, 51)'
            },
            success: {
                main: 'rgb(76,175,80)'
            }
        },
        typography: {
            fontFamily: 'Open Sans, Arial, sans-serif',
        }
    })
}