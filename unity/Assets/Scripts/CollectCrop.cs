using UnityEngine;

public class CollectCrops : MonoBehaviour
{
    [Header("Game objects")]
    public GameObject readyCrop;
    public bool isCropReady = true;
    public static int tomatoesCount = 0;

    public void Collect()
    {
        if (isCropReady)
        {
            readyCrop.SetActive(false);
            tomatoesCount++;
            isCropReady = false;
            MoneySystem.addMoney(10);
        }
    }
}
