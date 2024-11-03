export default function LeaderboardPage({ data }) {
  return (
    <div id="background" className="flex flex-col gap-y-4 h-screen w-screen pt-3 px-3">
      <h1 className="text-center text-5xl text-white">Leaderboard</h1>
      <div className="w-4/5 bg-white h-full mx-auto rounded-t-xl p-4">
        <div className="border-b-2 border-gray flex justify-between px-3">
          <h1 className="text-black text-5xl">Name</h1>
          <h1 className="text-black text-5xl">Score</h1>
        </div>
        <div className="my-3">
          {data.map((user, idx) => (
            <div key={idx} className="flex justify-between px-3 my-3">
              <h1 className="text-black text-3xl">{user.username}</h1>
              <h1 className="text-black text-3xl">{user.score}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const temp = await fetch("http://api.mockeyinterview.tech/leaderboard", {
    method: "GET"
  });
  const { data } = await temp.json();
  return {
    props: {
      data
    }
  };
};