import { aboutbg, c_office, globe, leaf, user } from "../assets";
import { happy } from "../assets";
import { keeping } from "../assets";
import {worker} from "../assets"


const AboutUs = () => {
  return (
    <div className="w-full">
      {/* ===== Header Banner Section ===== */}
      <div
        className="w-full flex flex-col justify-center items-center text-white text-center relative"
        style={{
          backgroundImage:`url(${aboutbg})`, // Change this image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          height:'351px'
          
        }}
      >
        <div className="absolute inset-0 z-10"></div>
        <div className="relative z-20">
          <h1 className="text-4xl font-bold mb-2 text-white" style={{color:'#37755c'}}>About Us</h1>
        </div>
      </div>

      {/* ===== WHO WE ARE Section ===== */}
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-10 items-center">
        {/* Left Image */}
        <div className="relative w-full md:w-1/2 right-[100px]">
          <img
         src={happy}
            alt="Cleaning Team"
            className="rounded-xl shadow-lg w-full"
            style={{height:'450px', width:'608px',objectFit:'cover', objectPosition:'center',borderRadius:'8px 8px 8px 8px'}}
          />
          <img
        src={c_office}
            alt="Circle Image"
            className="absolute bottom-[-30px] right-[-16px] w-36 h-36 rounded-full border-8 border-white shadow-xl object-cover"
        
         />
        </div>

        {/* Right Text */}
        <div className="w-full md:w-1/2">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium" style={{ fontSize: '16px' }}>
            Who We Are
          </p>
          <h2 className="text-3xl font-bold text-[#2a4f3e] mb-4" style={{ fontSize: '38px' }}>
            Professional quality cleaning with a personal touch
          </h2>
          <p className="text-gray-600 mb-6">
            We deliver top-notch cleaning services tailored to your needs. Our
            dedicated team ensures your space shines with professionalism and
            care, using eco-friendly practices and modern tools.
          </p>

          {/* Checkpoints */}
          <div className="space-y-6">
            {/* Point 1 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-lime-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-[#2a4f3e] text-lg">
                  Customer Focused Reviews
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Consectetuer pretium mi felis odio rhoncus congue lobortis a amet fames etiam.
                  Sit tincidunt magna praesent.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-lime-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                ✓
              </div>
              <div>
                <h4 className="font-semibold text-[#2a4f3e] text-lg">
                  We Are Committed
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Consectetuer pretium mi felis odio rhoncus congue lobortis a amet fames etiam.
                  Sit tincidunt magna praesent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Stats Section ===== */}
   <div className="bg-white py-12">
  <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 text-center">
    {[
      { number: "20+", label: "Activate Project" },
      { number: "97%", label: "Customer Satisfaction" },
      { number: "10+", label: "Awards Winning" },
      { number: "50+", label: "Expert Team" },
    ].map((item, index) => (
      <div
        key={index}
        className="border-r-2 border-dashed last:border-r-0"
        style={{ borderColor: "#B6D73E" }}
      >
        <h3 className="text-[#2a4f3e] font-bold text-[49px]">{item.number}</h3>
        <p className="text-gray-700 font-medium text-[18px] mt-2">
          {item.label}
        </p>
      </div>
    ))}
  </div>
</div>


      {/* ===== Service Cards Section ===== */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Residential Cleaning",
              desc: "Pretium aptent porta erat mollis fames aliquet nisi. Purus risus lacus tellus si cursus.",
              img:happy,
              
            },
            {
              title: "Apartment Cleaning",
              desc: "Pretium aptent porta erat mollis fames aliquet nisi. Purus risus lacus tellus si cursus.",
              img: keeping,
            },
            {
              title: "Commercial Cleaning",
              desc: "Pretium aptent porta erat mollis fames aliquet nisi. Purus risus lacus tellus si cursus.",
              img: worker,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative h-80 rounded-xl overflow-hidden shadow-lg group"
              style={{
                backgroundImage: `url(${item.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all"></div>
              <div className="absolute bottom-6 left-6 text-white z-10 max-w-xs">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm mb-4">{item.desc}</p>
                <button className="bg-lime-400 hover:bg-lime-500 text-white px-4 py-1 rounded shadow">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ===== OUR VALUE Section ===== */}
<div className="bg-white py-16 px-4 md:px-8 max-w-7xl mx-auto">
  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Our Value</p>
  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
    <h2 className="text-3xl font-bold text-[#2a4f3e] max-w-xl leading-snug">
      Welcome fresh air and bye bye unclean homes
    </h2>
    <p className="text-gray-600 mt-4 md:mt-0 max-w-xl">
      Sociosqu cras quisque sagittis massa urna volutpat. Platea mus vel ipsum litora fusce dui cursus.
      Eleifend litora erat proin semper vestibulum per magnis laoreet. Orci class consequat erat
      praesent mus ridiculus habitasse maecenas commodo amet magna. Sem nisl primis vehicula fermentum
      nulla vulputate mus penatibus nam.
    </p>
  </div>

  {/* Value Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {/* Card 1 */}
    <div className="bg-lime-50 border border-lime-100 p-6 rounded-xl shadow-sm">
      <div className="w-10 h-10 bg-lime-200 text-lime-800 flex items-center justify-center rounded-full mb-4 text-xl">
        <img src={user} style={{width:'30px', height:'30px'}}/>
      </div>
      <h4 className="font-bold text-[#2a4f3e] mb-2">Client Oriented</h4>
      <p className="text-sm text-gray-600">
        Libero pulvinar per ad gravida leo litora mollis semper elementum erat. Primis nibh nascetur cras.
      </p>
    </div>

    {/* Card 2 */}
    <div className="bg-lime-50 border border-lime-100 p-6 rounded-xl shadow-sm">
      <div className="w-10 h-10 bg-lime-200 text-lime-800 flex items-center justify-center rounded-full mb-4 text-xl">
        <img src={leaf} style={{width:'30px',height:'30px'}}/>
      </div>
      <h4 className="font-bold text-[#2a4f3e] mb-2">Eco-Friendly Oriented</h4>
      <p className="text-sm text-gray-600">
        Libero pulvinar per ad gravida leo litora mollis semper elementum erat. Primis nibh nascetur cras.
      </p>
    </div>

    {/* Card 3 */}
    <div className="bg-lime-50 border border-lime-100 p-6 rounded-xl shadow-sm">
      <div className="w-10 h-10 bg-lime-200 text-lime-800 flex items-center justify-center rounded-full mb-4 text-xl">
    <img src={globe} style={{height:'30px',width:'30px'}}/>
      </div>
      <h4 className="font-bold text-[#2a4f3e] mb-2">Expansion / Growth</h4>
      <p className="text-sm text-gray-600">
        Libero pulvinar per ad gravida leo litora mollis semper elementum erat. Primis nibh nascetur cras.
      </p>
    </div>
  </div>
</div>
{/* ===== OUR TEAM Section ===== */}
<div className="bg-white py-16 px-4 md:px-8 max-w-7xl mx-auto">
  <p className="text-sm text-gray-500 uppercase tracking-wide text-center">Our Team</p>
  <h2 className="text-3xl font-bold text-[#2a4f3e] text-center mb-10">
    We have a team of experts to serve you
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      {
        name: "Richard Brown",
        role: "HEAD IN PLUMBING",
        img: "/assets/team1.jpg",
      },
      {
        name: "Lynda Schultz",
        role: "OFFICE CLEANER",
        img: "/assets/team2.jpg",
      },
      {
        name: "Bryan Grenier",
        role: "WINDOW CLEANER",
        img: "/assets/team3.jpg",
      },
      {
        name: "Nicole Romero",
        role: "HOUSE CLEANER",
        img: "/assets/team4.jpg",
      },
    ].map((member, idx) => (
      <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden text-center relative group">
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-72 object-cover"
        />
        <div className="absolute top-4 right-4 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
          <a href="#" className="bg-lime-100 text-lime-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-200 text-sm">f</a>
          <a href="#" className="bg-lime-100 text-lime-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-200 text-sm">in</a>
          <a href="#" className="bg-lime-100 text-lime-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-200 text-sm">ig</a>
        </div>
        <div className="pt-5 pb-6 border-t-4 border-lime-500">
          <h4 className="font-bold text-lg text-[#2a4f3e]">{member.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{member.role}</p>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default AboutUs;
