import React from 'react'

function MovieButton({ id, title, poster_path, max_height }) {
    const max_h = `max-h-[${max_height}]`;
    const height = `h-[${max_height}]`;

    if (poster_path) {
        return (
            <img 
                className={`
                    ${max_h} aspect-[2/3] object-contain mx-2 my-3 
                    hover:scale-105 duration-[450ms] rounded-xl 
                    border-y-2 border-stone-800 hover:border-[#0000ff]`
                }
            />
        )
    }
}

export default MovieButton