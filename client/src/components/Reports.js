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
import { rotten, metacritic, imdb } from '../constants';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  maintainAspectRatio: false,
  
  responsive:false,
  text: 'Test',
};


export default function Report({ movie, predictedRating, predictedPersonalityRatings, predictedPersonalityTraits, tags, tagPersonalities, totalTagValues, prevalentTags }) {
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
    
    for (var trait in predictedPersonalityTraits) {
      if (predictedPersonalityTraits[trait]) {
        if (looped == total - 2 ){
          sentence += `<span className="font-bold ${confidence_to_color[predictedPersonalityTraits[trait]]}">${shortened_trait[trait]}</span> `
        } else if (total == 1 || looped < total - 1 || looped < total - 2) {
          sentence += `<span className="font-bold ${confidence_to_color[predictedPersonalityTraits[trait]]}">${shortened_trait[trait]}</span>, `
        } else {
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
            
          </Typography>
          <Grid  container alignItems='center' justifyContent='center' className="flex text-center">
            <div className = 'flex justify-center'>
            {movie.imdb_score && (<Grid item>
              <div>
              <img 
                        className='object-contain w-14 mx-10' 
                        src={imdb} 
                        alt="imdb"
                    />
              <div>{movie.imdb_score}</div>
              </div>
              </Grid>)}
              {movie.rotten_score && (<Grid item>
              <div>
              <img 
                        className='object-contain w-14 mx-10' 
                        src={rotten} 
                        alt="rotten"
                    />
              <div>{movie.rotten_score}</div>
              </div>
              </Grid>)}
              {movie.metacritic_score && (<Grid item>
              <div className = "text-center">
              <img 
                        className='object-contain w-14 mx-10' 
                        src={metacritic} 
                        alt="metacritic"
                    />
              <div>{movie.metacritic_score}</div>
              </div>
              </Grid>)}
            </div>
            </Grid>
            <div className = "text-center font-bold mt-5">
              Awards and Nominations
            </div>

            {movie.awards ? <div className = "text-center font-light">
              {movie.awards}
            </div> :
            <div className = "text-center font-light">
              This movie received no awards or nominations
            </div>}
         
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
            *Methodology (Predictive Modelling Based - Supervised): We sourced additional data from the MovieLens group to attain the personality 
            values for a user. To obtain our prediction, we took 20% (80/20 test-train split) of all users who rated the movie and passed
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
          <Typography>Prediction of Traits of Who Will Give a High Rating</Typography>
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
          
          <div className = "text-center">If you watch <span className="font-bold">{movie.title}</span> you are {parse(getTraitString())}<sup>[1]</sup></div>
 
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
          <div className = "font-thin text-center mt-4">
           *Prediction based on having a heavy weighting on a particular trait
          </div>
          <div className = "font-thin text-center mt-4">
          [1] Prediction based on correlation (Deviation Detection) of rating to personality value
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

          <div className="mt-5 mb-20">
      
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
        Overall Tag Personalities
      </Typography>
      
      <div className = "flex justify-center mb-10">
  
      <Pie data={{
      labels: ['Openness', 'Agreeableness', 'Conscientiousness', 'Emotional Stability', 'Extraversion'],
      datasets: [
        {
          data: totalTagValues,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
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
      <div className="text-center">
        <span className="font-bold">Predicted Tag-based Personality Traits:</span> {prevalentTags.map((tag, index) => (index == (prevalentTags.length - 1))? (<span className = "font-extralight">{tag}</span>):(<span className = "font-extralight">{tag}, </span>))}
      </div>
      <div className="text-center font-thin" >*The traits describe someone’s liking of the film based off the personalities around a tag</div>
      </div>

      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
            Individual Tag Personalities
      </Typography>
          <div className = "flex justify-center ">

          <Grid container spacing={2} className = "flex justify-center">

            {tagPersonalities.map((tagPersonality, index) => 
                <Grid item xs={3}>
                <br/>
                <br/>
                <br/>
            <Typography variant="h5" className = "flex justify-center w-[400px]">
            Tag:  {Object.keys(tagPersonality)}
            </Typography>
            <Pie key = {index} data={{
    labels: ['Openness', 'Agreeableness', 'Conscientiousness', 'Emotional Stability', 'Extraversion'],
    datasets: [
      {
        data: Object.values((Object.values(tagPersonality))[0]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
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
  </Grid>
    )}
    </Grid>
    </div>

    
        </AccordionDetails>
      </Accordion>) : null}
    </div>
  );
}

