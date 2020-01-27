function sleep(mlsec)
{
  var time = new Date().getTime();
  while(true)
  {
    if ((new Date().getTime() - time) > mlsec)
    {
      break;
    }
  }
}