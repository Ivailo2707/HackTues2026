using UnityEngine;

public class ChangeField : MonoBehaviour
{
    [Header("Settings")]
    public GameObject crop;
    public float xScale = 7;
    public float zScale = 4;
    
    private void Start()
    {
        if(crop != null)
            transform.localScale = new Vector3(xScale, 1, zScale);
    }
}
