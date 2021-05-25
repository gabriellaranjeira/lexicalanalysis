import {React, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from './Components/Card';
import TableLexical from './Components/Table';
import { TextField  } from '@material-ui/core';
import Lex from 'lexical-parser';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [lexObj, setLexObj] = useState([]);
  const [input, setInput] = useState('block { int a = 0 int b = 3 if (a < b && b > a) { print("Hello World") } }');
  

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const analyser = () => {
    console.log(input);

    const RW_types = {
      block: {
        type: "RESERVED WORD",
        name: 'BLOCK'
      },
      if: {
        type: "RESERVED WORD",
        name: 'IF'
      },
      '{':{
        type: "RESERVED WORD",
        name: 'L_BRACKET'
      },
      '}':{
        type: "RESERVED WORD",
        name: 'R_BRACKET'
      },
      '(':{
        type: "RESERVED WORD",
        name: 'L_PAREN'
      },
      ')':{
        type: "RESERVED WORD",
        name: 'R_PAREN'
      },
      '<':{
        type: "OP",
        name: 'OP_BIGGER'
      },
      '>':{
        type: "OP",
        name: 'OP_SMALLER'
      },
      '=':{
        type: "OP",
        name: 'OP_EQUALS'
      },
      '&&':{
        type: "COND",
        name: 'COND_E'
      },
      '*':{
        type: "OP",
        name: 'OP_MULTIPLICATION'
      },
      '+':{
        type: "OP",
        name: 'OP_SUM'
      },
      '-':{
        type: "OP",
        name: 'OP_SUBTRACTION'
      },
      '/':{
        type: "OP",
        name: 'OP_DIVISION'
      },
      ';':{
        type: "RESERVED WORD",
        name:'SEMICOLON'
      },
      'int':{
        type: "TYPE_VARIABLE",
        name:'INTEGER'
      },
      'string':{
        type: "TYPE_VARIABLE",
        name:'STRING'
      },
      print:{
        type: "FUNCTION",
        name: "FUNCTION"
      }
    }
    const tokenMatchers = [
      'block',
      'if',
      '{',
      '}',
      '(',
      ')',
      '<',
      '>',
      '=',
      '&&',
      'int',
      'string',
      '*',
      '+',
      '-',
      '/',
      ';',
      'print',
      ['INTEGER', /[0-9]+/],
      ['ID', /[a-zA-Z][a-zA-Z0-9]*/],
      ['STRING', /\".*?\"/]
    ]
    // The pattern to ignore in the input
    const ignorePattern = '[\n\s \t]+';
    
    const lex = new Lex(input, tokenMatchers, ignorePattern);
    var token;
    const lexArr = [];
    try {
      do {
        token = lex.nextToken();
        if(token.name != 'INTEGER' && token.name != 'ID' && token.name != 'STRING'){
          console.log(token.name);
          lexArr.push({
            name: RW_types[token.name].name,
            type: RW_types[token.name].type,
            value: token.lexeme,
            position: token.position,
          });
        }else{
          lexArr.push({
            name: token.name,
            type: 'VARIABLE',
            value: token.lexeme,
            position: token.position,
          });
        }
      } while (token)
    } catch (err) {
      if (err.code === "LEXICAL_ERROR") {
        console.log(`\n${err.message}\n`)
        console.log(`Position: ${err.position}`)
        console.log(`Character: ${err.character}`)
        console.log(`Nearby code: ${err.nearbyCode}`)
      }
      else
        console.log(err)
    }

    console.log(lexArr);
    setLexObj(lexArr);
    
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <TextField 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                multiline={true} 
                rows={10} 
                />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Card analyser={analyser} />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <TableLexical tableRows={lexObj} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}