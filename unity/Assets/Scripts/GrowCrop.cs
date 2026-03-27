using UnityEngine;

public class GrowCrop : MonoBehaviour
{
    [Header("Game objects")]
    public GameObject oldCrop;
    public GameObject newCrop;
    public bool isCropYoung = true;
    public bool isCropCollected = false;

    [Header("Settings")]
    public float timer = 3;

    public void ChangeCrops()
    {
        isCropCollected = true;
        Invoke("DisableOld", timer);
    }

    private void DisableOld()
    {
        oldCrop.SetActive(false);
        newCrop.SetActive(true);
        isCropYoung = false;
    }
}
