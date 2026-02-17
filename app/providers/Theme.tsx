import { useContext, useMemo, type ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'

import { ChosenTheme } from './ChosenTheme'
import { CssBaseline } from '@mui/material'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { theme } = useContext(ChosenTheme)
    const muiTheme = useMemo(() => createThemeHelper(theme), [theme])

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    )
}

const brandColorLight = '#243F76'
const brandColorDark = '#056bb5'
export const createThemeHelper = (theme: 'dark' | 'light') => {
    const isDark = theme === 'dark'
    return createTheme({
        palette: {
            mode: theme,
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