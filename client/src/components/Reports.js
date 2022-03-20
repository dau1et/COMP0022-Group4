import React, { useEffect, useState } from 'react'; 
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getPredictedRating, getPredictedPersonalityRatings, getPredictedPersonalityTraits } from '../api/fetches';
import parse from 'html-react-parser'
import { Grid } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const pieData = {
  labels: ['Agreeableness', 'Conscientiousness', 'Emotional Stability', 'Extraversion', 'Openness'],
  datasets: [
    {
      data: [1, 2, 3, 4, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1,
    },
  ]}

  // const data = {
  //   labels: ['Agreeableness', 'Conscientiousness', 'Emotional Stability', 'Extraversion', 'Openness'],
  //   datasets: [
  //     {
  //       data: Object.values((Object.values(tPersonalities[0]))[0]),
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(255, 206, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(153, 102, 255, 0.2)'
  //       ],
  //       borderColor: [
  //         'rgba(255, 99, 132, 1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //         'rgba(153, 102, 255, 1)'
  //       ],
  //       borderWidth: 1,
  //     },
  //   ]}

export const options = {
  maintainAspectRatio: false,
  
  responsive:false,
  hover: {mode: null},
  text: 'Test',
};


export default function Report({ movie, predictedRating, predictedPersonalityRatings, predictedPersonalityTraits, tags, tagPersonalities }) {
  var pred_arr = []
  for (var pred in predictedPersonalityRatings){
    pred_arr.push(predictedPersonalityRatings[pred]);
  }
  var pred_data = {0:{color:"text-fuchsia-400", text:"Open"},1:{color:"text-orange-400", text:"Agreeable"},2:{color:"text-cyan-300", text:"Emotionally Stable"},3:{color:"text-emerald-300", text:"Conscientious"},4:{color:"text-blue-500", text:"Extroverted"}}
  
  function getTraitString(){
    console.log(movie)
    var sentence = ""
    var confidence_to_color = {"L":"text-red-500","M":"text-orange-500","H":"text-green-500"}
    var shortened_trait = {"openness":"open","agreeableness":"agreeable","emotional_stability":"emotionally stable","conscientiousness":"conscientious","extraversion":"extroverted"}
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
    <div className='mb-16'>
      <Accordion style={{"marginLeft": '10%', "marginRight": '10%', "marginBottom": "1%"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
          style={{backgroundColor: '#003080', color: '#ffffff'}}
        >
          <Typography>Viewer Reactions</Typography>
        </AccordionSummary>
        <AccordionDetails style={{backgroundColor: '#111111', color: '#ffffff', padding: '20px'}}>
          <Typography variant="h5" align="center">
            Individual Tag Personalities
          </Typography>

          <div>
            {movie.awards}
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion style={{"marginLeft": '10%', "marginRight": '10%', "marginBottom": "1%"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{backgroundColor: '#003080', color: '#ffffff', height: "24px"}}
        >
          <Typography style={{height: "24px"}}>Prediction of Rating With Small Audience</Typography>
        </AccordionSummary>
        <AccordionDetails style={{backgroundColor: '#111111', color: '#ffffff', padding: '20px'}}>
        <Typography variant="h5" align="center">
          Predicted Rating
        </Typography>
        <div align="center" style={{display: 'inlineFlex', 'justifyContent': 'center', 'textAlign': 'center'}}>
        <div  className = "font-bold text-5xl text-center"> 
          {predictedRating * 2}
        </div>
        
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
          <Typography align='center' sx={{ px:"30%" }}>
            *Methodology: e.g We sourced additional data from the MovieLens group to attain the personality 
            values for a user. To obtain our prediction, we took 20% of all users who rated the movie and passed
            their personality data into a KNeighborsRegressor regression model. We conducted some preprocessing
            in the form of scaling to normalise the data.
          </Typography>
        </div>
        
        </AccordionDetails>
      </Accordion>
      <Accordion style={{"marginLeft": '10%', "marginRight": "10%", "marginBottom": "1%"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          style={{backgroundColor: '#003080', color: '#ffffff'}}
        >
          <Typography>Prediction of Traits of who will give a High Rating</Typography>
        </AccordionSummary>
        <AccordionDetails style={{backgroundColor: '#111111', color: '#ffffff', padding: '20px'}}>
          <div className="text-right">
          <div className="mr-6 font-semibold mb-1">
            Confidence Rating
          </div>
          <kbd className='bg-green-600 mx-2 px-1'>High</kbd>
          <kbd className='bg-orange-500 mx-2 px-1'>Medium</kbd>
          <kbd className='bg-red-600 mx-2 px-1'>Low</kbd>
          </div>
          
          <div className = "text-center">If you watch <span className="font-bold">{movie.title}</span> you are {parse(getTraitString())}</div>
          <div className = "mt-7 text-center font-bold mb-5">Predictions based on Personality Type</div>
          <Grid container spacing={20} alignItems='center' justifyContent='center'>
            {pred_arr.map((rating, index) => {
              return (
                <Grid item>
                  {/* <Item></Item> */}
                  <div>
                    <div className='flex justify-center'>
                    {pred_data[index].text}
                    </div>
                    <div key={index} className = {`${pred_data[index].color} font-bold text-5xl flex justify-center`} >
                        {(rating * 2).toFixed(2)}
                    </div>
                    <div className = "flex justify-center">
                    {
                    ((movie.average_rating * 2).toFixed(1) - (rating * 2)).toFixed(2) == 0.0?
                    (
                    <Typography style={{color: 'green'}}>
                    (=)
                    </Typography>
                    ) :
                    (((movie.average_rating * 2) - (rating * 2)).toFixed(2) > 0? 
                    (
                    <Typography style={{color: 'red'}}>
                      (-{((movie.average_rating * 2).toFixed(1) - (rating * 2)).toFixed(2)})
                    </Typography>
                    ) :
                    (
                    <Typography style={{color: 'green'}}>
                      ({-(((movie.average_rating * 2).toFixed(1) - (rating * 2)).toFixed(2))})
                    </Typography>
                    ))
                    }
                    </div>
                  </div>
                </Grid>
              )     
            })}
          </Grid>
          {/* {pred_arr.map((rating, index) => {
            return(
                    <div className = "flex-1">
                      <div >
                      {pred_data[index].text}
                      </div>
                      <div key={index} className = {`${pred_data[index].color} font-bold text-5xl`}>
                          {rating * 2}
                      </div>
                      <div>
                      {
                      ((movie.average_rating * 2).toFixed(1) - (rating * 2)).toFixed(2) == 0.0?
                      (
                      <Typography style={{color: 'green'}}>
                      (=)
                      </Typography>
                      ) :
                      (((movie.average_rating * 2) - (rating * 2)).toFixed(2) > 0? 
                      (
                      <Typography style={{color: 'red'}}>
                        (-{((movie.average_rating * 2).toFixed(1) - (rating * 2)).toFixed(2)})
                      </Typography>
                      ) :
                      (
                        <Typography style={{color: 'green'}}>
                        ({-(((movie.average_rating * 2).toFixed(1) - (rating * 2)).toFixed(2))})
                      </Typography>
                      ))}
                      </div>
                    </div>)
            })} */}
          <div className = "font-extralight text-center mt-4">
          *Prediction based on having a heavy weighting on a particular trait
          </div>
        </AccordionDetails>
      </Accordion>
      {(tagPersonalities.length > 0)? ( 
      <Accordion style={{"marginLeft": '10%', "marginRight": '10%', "marginBottom": "1%"}}>
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
          <br/>
          <br/>

          <div className = "flex justify-center">

            {tagPersonalities.map((tagPersonality, index) => 
            <div >
              <Typography variant="h6" align="center">
            Tag: {Object.keys(tagPersonality)}
            </Typography>
            
            <br/>
            
            <Pie key = {index} data={{
    labels: ['Openness', 'Agreeableness', 'Conscientiousness', 'Emotional Stability', 'Extraversion'],
    datasets: [
      {
        data: Object.values((Object.values(tagPersonality))[0]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ]}} width={400} height={400} options={options}/> 
    </div>
    )}
            
          </div>
        </AccordionDetails>
      </Accordion>) : null}
    </div>
  );
}

