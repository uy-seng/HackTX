import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// TODO: Update mock data to dynamic data for the problems
// Predefined problem and solutions
const problem =
  "Giventwosortedarraysnums1andnums2ofsizemandnrespectively,returnthemedianofthetwosortedarrays.TheoverallruntimecomplexityshouldbeO(log(m+n)).Example1:Input:nums1=[1,3],nums2=[2]Output:2.00000Explanation:mergedarray=[1,2,3]andmedianis2.Example2:Input:nums1=[1,2],nums2=[3,4]Output:2.50000Explanation:mergedarray=[1,2,3,4]andmedianis(2+3)/2=2.5.";
const solutions = [
  "classSolution:deffindMedianSortedArrays(self,nums1:List[int],nums2:List[int])->float:m,n=len(nums1),len(nums2)p1,p2=0,0defget_min():nonlocalp1,p2ifp1<m&&p2<n:ifnums1[p1]<nums2[p2]:ans=nums1[p1]p1+=1else:ans=nums2[p2]p2+=1elifp2==n:ans=nums1[p1]p1+=1else:ans=nums2[p2]p2+=1returnansif(m+n)%2==0:for_inrange((m+n)//2-1):_=get_min()return(get_min()+get_min())/2else:for_inrange((m+n)//2):_=get_min()returnget_min()",
  "classSolution:deffindMedianSortedArrays(self,A:List[int],B:List[int])->float:na,nblen(A),len(B)n=na+nbdefsolve(k,a_start,a_end,b_start,b_end):if(a_start>a_end):returnB[k-a_start]if(b_start>b_end):returnA[k-b_start]a_index,b_index=(a_start+a_end)//2,(b_start+b_end)//2a_value,b_value=A[a_index],B[b_index]ifa_index+b_index<k:ifa_value>b_value:returnsolve(k,a_start,a_end,b_index+1,b_end)elsereturnsolve(k,a_index+1,a_end,b_start,b_end)else:ifa_value>b_value:returnsolve(k,a_start,a_index-1,b_start,b_end)elsereturnsolve(k,a_start,a_end,b_start,b_index-1)ifn%2:returnsolve(n//2,0,na-1,0,nb-1)elsereturn(solve(n//2-1,0,na-1,0,nb-1)+solve(n//2,0,na-1,0,nb-1))/2",
  "classSolution:def findMedianSortedArrays(self,nums1:List[int],nums2:List[int])->float:iflen(nums1)>len(nums2):returnself.findMedianSortedArrays(nums2,nums1)m,n=len(nums1),len(nums2)left,right=0,mwhileleft<=right:partitionA=(left+right)//2partitionB=(m+n+1)//2-partitionAmaxLeftA=(float('-inf')ifpartitionA==0elsnums1[partitionA-1])minRightA=float('inf')ifpartitionA==melse nums1[partitionA]maxLeftB=(float('-inf')ifpartitionB==0elsnums2[partitionB-1])minRightB=float('inf')ifpartitionB==nelse nums2[partitionB]ifmaxLeftA<=minRightB&&maxLeftB<=minRightA:if(m+n)%2==0:return(max(maxLeftA,maxLeftB)+min(minRightA,minRightB))/2elsereturnmax(maxLeftA,maxLeftB)elifmaxLeftA>minRightB:right=partitionA-1else:left=partitionA+1",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { userMessage } = req.body;
  // Create interview prompt
  const promptTemplate = `
You are an AI simulating a technical interviewer for a coding problem. Your task is to engage in a realistic interview conversation, focusing on the interviewee's problem-solving approach rather than just the final solution.

<problem>
${problem}
</problem>

<solutions>
${solutions.join("")}
</solutions>

Instructions:
1. Present the problem to the interviewee.
2. Listen to their approach and guide them if they're going in the wrong direction.
3. Ask about time and space complexity.
4. Push for optimization if they provide a brute force solution.
5. Inquire about alternative approaches if they provide an optimal solution.
6. Conclude the interview with a rating and feedback on their problem-solving approach.

Format the conversation as follows:
[Interviewer] Your questions or comments (Do not include [Interviewer])
[Interviewee] The user's responses (Do not generate these)

At the end of the interview, provide a rating and feedback using <evaluation> tags.
`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0,
      messages: [
        { role: "user", content: [{ type: "text", text: promptTemplate }] },
        {
          role: "assistant",
          content: [{ type: "text", text: "<interviewer_analysis>" }],
        },
        { role: "user", content: [{ type: "text", text: userMessage }] },
      ],
    });

    res.status(200).json({ content: response.content });
  } catch (error) {
    console.error("Error with Anthropic API:", error);
    res.status(500).json({ error: "Error with Anthropic API" });
  }
}
