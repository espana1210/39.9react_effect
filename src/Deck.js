import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";

const Deck = () => {
    const[deck, setDeck] = useState(null);
    const[drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        async function getData(){
            let d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
            setDeck(d.data);
        }
        getData();

    },[setDeck]);

    useEffect (() => {
        async function getCard(){
            let { deck_id } = deck;

            try {
                let drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);

                if(drawRes.data.remaining === 0){
                    setAutoDraw(false);
                    throw new Error("no cards remaining!");
                }
                const card= drawRes.data.cards[0];

                setDrawn(d=>[
                    ...d,
                    {
                        id: card.code,
                        name: card.suit + "" + card.value,
                        image: card.image

                    }
                ])
            } catch(err) {
                alert(err);
            }
        }
        if (autoDraw && !timerRef.current) {
            timerRef.current = null;
        };

    },[autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

    return (
      <div className="deck">
        {deck ? (
          <button className="Deck-gimme" onClick={toggleAutoDraw}>
            {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
          </button>    
        ):null}
        <div className="Deck-cardarea">{cards}</div>
        </div>
    );
}
export default Deck;
