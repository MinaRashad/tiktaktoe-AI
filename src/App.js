import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';


class Game extends React.Component{
  constructor(props){
    super(props)
    this.state = {
        history:[Array(9).fill(null)],
        current_turn:'X',
        winner: false,

    };
  }

  // handler for square click
  square_click= (i)=>{
    // make copy of state variables
    let history = this.state.history.slice()
    let len = history.length
    let squares = history[len-1].slice()

    // if game didnt end and square is empty
    if (!squares[i] && !this.state.winner){
        squares[i] = this.state.current_turn
        let next_turn = this.state.current_turn === "X" ? "O" : "X"
        let win = calc_win(squares)
        history.push(squares)
        this.setState({history:history, current_turn:next_turn, winner:win})
        console.log(`winner: ${win}`)
      }
  }
  // jumps to a specific part in history
  jumpto = (idx)=>{
    let newHistory = this.state.history.slice(0,idx+1)
    let next_turn = idx%2? "O" : "X"
    let winner = calc_win(newHistory[newHistory.length-1])
    this.setState({history:newHistory, current_turn:next_turn, winner:winner})

  }
  render(){
    console.log("Yaaa")
    let status = this.state.winner? `Winner: ${this.state.winner}` :`Player ${this.state.current_turn} turn`;
    const length = this.state.history.length
    const current = this.state.history[length-1]
    const winner = this.state.winner
    const moves = this.state.history.map((curr, idx)=>{
      // make the moves list
            let move_name = !idx? "Go to game start" : `Go to move #${idx+1}`
            if(idx === length-1){
              move_name = <b>{move_name}</b>
            }
            return (
              <li key={idx}> 
                <button onClick={()=>this.jumpto(idx)}>
                {move_name}
                </button>
              </li>
            )
          })
    
    const free = free_squares(current)
    console.log(free)
    
    if (!winner && !free.length){
      status = 'Draw'
    }
    
    return (
            <div className='game'>
              <div className='game-board'>
                  <Board className={(free_squares(current).length === 0 && !winner ) ?'draw':''} squares={this.state.history[this.state.history.length -1]} 
                    current_turn={this.state.current_turn} 
                   onClick={this.square_click} />
              </div>
              <div className='game-info'>
                  <div>
                  <b>{status}</b>
                    
                  </div>
                  <ol>
                    {moves}
                  </ol>
              </div>
            </div>
          );
  }
}

class Board extends React.Component{
  renderSquare= (i)=>{
    let position = winning_squares(this.props.squares);
    let win = '' //will have 'win' if it is a winning square
    if(position){
      if(position.indexOf(i) !== -1) win = 'win'
    }
    return (<Square 
              className={this.props.className + win}
              value={this.props.squares[i]} 
              onClick={()=> this.props.onClick(i)}
              key={i} />) 
  }
  render(){
    const rows = [];
    for(let i=0; i<3; i++){
      let children = []

      for(let j=0; j<3; j++){
        children.push(this.renderSquare(3*i + j))
      }

      rows.push(React.createElement('div', {className:'board-row'} , children))
    }
    return (
      
      <div>
        {rows}
      </div>

    );
  }
}

function Square(props){
    return (
      <button className={'square ' + props.className} onClick={props.onClick}>
        {props.value}
      </button>
    )
}

function free_squares(squares){
  let free = []
  for(let i=0;i< squares.length; i++){
    if(squares[i] === null) free.push(i)
  }
  return free
}

function calc_win(squares){
  let winning_positions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  for(let position of winning_positions){
      let [a,b,c] = position
      if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
        return squares[position[0]]
      }
    
  }
  return false;
}
// same as previous one but this one returns the winning position
// why? because Iam too lazy to remake all previous code again

function winning_squares(squares){
  let winning_positions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  for(let position of winning_positions){
      let [a,b,c] = position
      if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
        return position
      }
    
  }
  return false;
}

export default Game;