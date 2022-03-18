import React from 'react';

function Details({ movie }) {
  console.log(movie);

  function formatTime(duration) {
      // 'Minutes' to 'Hours h Minutes m'
      return Math.floor(duration / 60) + "h " + duration % 60 + "m";
  }

  function formatCash(amount) {
      // 'XXXXXXX' to '$X,XXX,XXX'
      return '$' + amount.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  function formatDate(date) {
      // 'YYYY-MM-DD{T}HH:MM:SS' to 'DD/MM/YYYY'
      var parts = date.split("T")[0].split('-').reverse();
      return parts.join('/');
  }

  return (
    <div className='columns-3 bg-stone-800 p-6 w-3/4 max-w-[1000px]'>
        <span className=''>Budget: {formatCash(movie.budget)}</span>
        <span className=''>Adult: {'\u2717 \u274C'}</span>
        <span className=''>Release Date: {formatDate(movie.release_date)}</span>
        <span className=''>Revenue: {formatCash(movie.revenue)}</span>
        <span className=''>Language: {movie.id}</span>
        <span className=''>Runtime: {formatTime(movie.runtime)}</span>
        <span className=''>Translations: {movie.id}</span>
        <span className=''>Publishing Company: {movie.id}</span>
        <span className=''>Publishing Country: {movie.id}</span>
        <span className=''>Cast: {movie.id}</span>
    </div>
  )
}

export default Details;