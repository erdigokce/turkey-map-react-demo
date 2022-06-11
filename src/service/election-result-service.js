const parsePartyVotes = (partyKeys, result, candidates) => partyKeys.map((key) => {
  if (result[key] > 0) {
    return ({ [candidates[key]]: result[key] });
  }
  return null;
}).filter((partyVote) => !!partyVote);

// eslint-disable-next-line import/prefer-default-export
export const handleElectionResult = (results, candidates) => results.map((result) => {
  const partyKeys = Object.keys(result).filter((key) => key.startsWith('parti') && key.endsWith('_ALDIGI_OY'));
  const parsedCandidates = {};
  candidates.forEach((candidate) => { parsedCandidates[candidate.column_NAME] = candidate.ad; });
  return ({
    county: result.ilce_ADI,
    voteCount: result.oy_KULLANAN_SECMEN_SAYISI,
    electorCount: result.secmen_SAYISI,
    totalIndependentVotes: result.bagimsiz_TOPLAM_OY,
    totalValidVotes: result.gecerli_OY_TOPLAMI,
    totalInvalidVotes: result.gecersiz_OY_TOPLAMI,
    votesOfParties: parsePartyVotes(partyKeys, result, parsedCandidates),
  });
});
