import React from 'react';
import { quote } from '../assets';
interface Testimonial {
  name: string;
  location: string;
  text: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Steven Nadeau",
    location: "JAKARTA",
    text: "Taciti ut fringilla vestibulum lectus justo etiam vel aliquam lacinia cubilia ex. Gravida faucibus cubilia vulputate dictum venenatis. Ligula purus neque dui tortor dictumst. Efficitur rhoncus aenean et si parturient fames accumsan.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Steven Nadeau",
    location: "JAKARTA",
    text: "Taciti ut fringilla vestibulum lectus justo etiam vel aliquam lacinia cubilia ex. Gravida faucibus cubilia vulputate dictum venenatis. Ligula purus neque dui tortor dictumst. Efficitur rhoncus aenean et si parturient fames accumsan.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Steven Nadeau",
    location: "JAKARTA",
    text: "Taciti ut fringilla vestibulum lectus justo etiam vel aliquam lacinia cubilia ex. Gravida faucibus cubilia vulputate dictum venenatis. Ligula purus neque dui tortor dictumst. Efficitur rhoncus aenean et si parturient fames accumsan.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

const ReviewSection: React.FC = () => {
  return (
    <div className=" pb-12 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
        What Our Customer Say
      </h2>
      <div className="w-20 h-1 bg-yellow-400 mx-auto mt-2 mb-10 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10 mb-10">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-[#f3fbd8] rounded-lg p-6 shadow-md relative"
          >
            <div className="absolute top-0 right-0 bg-lime-500 text-white  w-8 h-8 flex items-center justify-center text-lg" style={{padding:'15px 15px 5px 15px', borderRadius:'0px 8px 0px 35px' ,height:'70px',width:'67px'}}>
              <img src={quote} style={{height:'30px' , width:'30px',marginBottom:'15px'}}/>
            </div>
            <div className="text-yellow-500 text-xl mb-3">
              {"★".repeat(5)}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              {item.text}
            </p>
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <h4 className="text-sm font-semibold text-[#2cba45]">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500">{item.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
