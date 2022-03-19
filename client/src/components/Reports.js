import React, { useEffect, useState } from 'react'; 
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getPredictedRating, getPredictedPersonalityRatings, getPredictedPersonalityTraits } from '../api/fetches';
import parse from 'html-react-parser'

export default  function Report({ movie, predictedRating, predictedPersonalityRatings, predictedPersonalityTraits }) {
  var pred_arr = []
  for (var pred in predictedPersonalityRatings){
    pred_arr.push(predictedPersonalityRatings[pred]);
  }
  var pred_data = {0:{color:"text-red-500", text:"openness"},1:{color:"text-red-500", text:"agreeableness"},2:{color:"text-red-500", text:"emotional_stability"},3:{color:"text-red-500", text:"conscientiousness"},4:{color:"text-red-500", text:"extraversion"}}
  
  function getTraitString(){
    console.log(predictedPersonalityRatings)
    var sentence = ""
    var confidence_to_color = {"L":"text-red-500","M":"text-orange-500","H":"text-green-500"}
    var shortened_trait = {"openness":"open","agreeableness":"agreeable","emotional_stability":"emotionally stable","conscientiousness":"conscientious","extraversion":"extraverted"}
    var total = 0;
    var looped = 0;

    for (var trait in predictedPersonalityTraits){
      if(predictedPersonalityTraits[trait]){
        total += 1;
      }
    }
    
    for (var trait in predictedPersonalityTraits){
      if (predictedPersonalityTraits[trait]){
        if(looped == total - 2 ){
          sentence += `<span className="font-bold ${confidence_to_color[predictedPersonalityTraits[trait]]}">${shortened_trait[trait]}</span> `
        } else if(total == 1 || looped < total - 1 || looped < total - 2) {
          sentence += `<span className="font-bold ${confidence_to_color[predictedPersonalityTraits[trait]]}">${shortened_trait[trait]}</span>, `
        } else{
          sentence += `and <span className="font-bold ${confidence_to_color[predictedPersonalityTraits[trait]]}">${shortened_trait[trait]}</span>`
        }
        looped += 1
      }

    }
    return sentence;
  };

  return (
    <div>
      <Accordion style={{"marginLeft": '10%', "marginRight": '10%'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{backgroundColor: '#003080', color: '#ffffff'}}
        >
          <Typography>Prediction of Rating With Small Audience</Typography>
        </AccordionSummary>
        <AccordionDetails style={{backgroundColor: '#111111', color: '#ffffff', padding: '20px'}}>
        <Typography variant="h5" align="center">
          Predicted Rating
        </Typography>
        <div align="center" style={{display: 'inlineFlex', 'justifyContent': 'center', 'textAlign': 'center'}}>
        <Typography variant="h3" align="center"> 
          {predictedRating * 2}
        </Typography>
        
        {
        ((movie.average_rating * 2).toFixed(1) - (predictedRating * 2)).toFixed(2) == 0.0?
        (
        <Typography variant="h5" style={{color: 'green'}}>
        (=)
        </Typography>
        ) :
        (((movie.average_rating * 2) - (predictedRating * 2)).toFixed(2) > 0? 
        (
        <Typography variant="h5" style={{color: 'red'}}>
          (-{((movie.average_rating * 2).toFixed(1) - (predictedRating * 2)).toFixed(2)})
        </Typography>
        ) :
        (
          <Typography variant="h5" style={{color: 'green'}}>
          ({-(((movie.average_rating * 2).toFixed(1) - (predictedRating * 2)).toFixed(2))})
        </Typography>
        ))}
        </div>
        <br/>
        <div>
          <Typography>
          *Methodology: e.g We sourced additional data from the MovieLens group to attain the personality 
          values for a user. To obtain our prediction, we took 20% of all users who rated the movie and passed
          their personality data into a KNeighborsRegressor regression model. We conducted some preprocessing
          in the form of scaling to normalise the data.
          </Typography>
        </div>
        
        </AccordionDetails>
      </Accordion>
      <Accordion  style={{"marginLeft": '10%', "marginRight": '10%'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          style={{backgroundColor: '#003080', color: '#ffffff'}}
        >
          <Typography>Prediction of Traits of who will give a High Rating</Typography>
        </AccordionSummary>
        <AccordionDetails style={{backgroundColor: '#111111', color: '#ffffff', padding: '20px'}}>
          <div className = "text-center">If you watch <span className="font-bold">{movie.title}</span> you are {parse(getTraitString())}</div>
          <div className = "mt-7 text-center font-bold">Predictions based on Personality Type</div>
          {pred_arr.map((rating, index) => {
            return(
                    <div className = {`${pred_data[index].color}`}>
                      <div>
                      {pred_data[index].text}
                      </div>
                      <div key={index}>
                          {rating}
                      </div>
                      <div>
                      </div>
                    </div>)
            })}
          
        </AccordionDetails>
      </Accordion>

      <Accordion style={{"marginLeft": '10%', "marginRight": '10%'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
          style={{backgroundColor: '#003080', color: '#ffffff'}}
        >
          <Typography>Prediction of Traits Based on Tags</Typography>
        </AccordionSummary>
        <AccordionDetails style={{backgroundColor: '#111111', color: '#ffffff', padding: '20px'}}>
          <Typography variant="h5" align="center">
            Individual Tag Personalities
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

